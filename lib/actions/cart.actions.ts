"use server"

import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    )
    const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
    const taxPrice = round2(0.15 * itemsPrice)
    const totalPrice = round2(itemsPrice + taxPrice + shippingPrice)

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2)
    }
}

export async function addItemToCart(data: CartItem) {
    try {
        const sessionCartId = (await cookies()).get("sessionCartId")?.value
        if(!sessionCartId) throw new Error("Cart session not found.")

        const session = await auth()
        const userId = session?.user?.id ? (session.user.id as string) : undefined

        // Get Cart
        const cart = await getCart()

        // Parse and validate item
        const item = cartItemSchema.parse(data)

        // Find product in database
        const product = await prisma.product.findFirst({
            where: {id: item.productId}
        })

        if(!product) throw new Error("Product not found.")

        if(!cart) {
            // Create new cart object
            const newCart = insertCartSchema.parse({
                userId: userId,
                items: [item],
                sessionCartId: sessionCartId,
                ...calcPrice([item])
            })

            // Add to database
            await prisma.cart.create({
                data: newCart
            })

            // Revalidate product page
            revalidatePath(`/product/${product.slug}`)

            return {
                success: true,
                message: `${product.name} added to cart`
            }
        }else {
            // Check if item is already in cart
            const existItem = (cart.items as CartItem[]).find(
                (x) => x.productId === item.productId
            )

            if(existItem) {
                // Check stock
                if(product.stock < existItem.qty + 1) {
                    throw new Error("Not enough stock")
                }

                // Increase the quantity
                (cart.items as CartItem[]).find(
                    (x)=> x.productId === item.productId
                )!.qty = existItem.qty + 1
            }else {
                // If item does not exist in cart
                // check stock
                if(product.stock < 1) throw new Error("Not enough stock")
                
                // Add item to the cart.items
                cart.items.push(item)
            }

            // Save to database
            await prisma.cart.update({
                where: {id: cart.id},
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...calcPrice(cart.items as CartItem[])
                }
            })

            revalidatePath(`/product/${product.slug}`)

            return {
                success: true,
                message: `${product.name} ${existItem ? "updated in cart" : "added to cart"}`
            }
        }
        
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

export async function getCart() {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value
    if(!sessionCartId) throw new Error("Cart session not found")

    // Get session and user ID
    const session = await auth()
    const userId = session?.user?.id ? (session.user.id as string) : undefined

    // Get user cart from database
    const cart = await prisma.cart.findFirst({
        where: userId ? { userId: userId} : {sessionCartId: sessionCartId}
    })

    if(!cart) return undefined

    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    })
}


export async function removeItemFromCart(productId: string) {
    try {
      // Check for cart cookie
      const sessionCartId = (await cookies()).get('sessionCartId')?.value;
      if (!sessionCartId) throw new Error('Cart session not found');
  
      // Get Product
      const product = await prisma.product.findFirst({
        where: { id: productId },
      });

      if (!product) throw new Error('Product not found');
  
      // Get user cart
      const cart = await getCart();
      if (!cart) throw new Error('Cart not found');
  
      // Check for item
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === productId
      );
      if (!existItem) throw new Error('Item not found');
  
      // Check if only one in qty
      if (existItem.qty === 1) {
        // Remove from cart
        cart.items = (cart.items as CartItem[]).filter(
          (x) => x.productId !== existItem.productId
        );
      } else {
        // Decrease qty
        (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        existItem.qty - 1;
      }
  
      // Update cart in database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });
  
      revalidatePath(`/product/${product.slug}`);

      if(existItem.qty === 1) {
        return {
            success: true,
            message: `${product.name} was removed from cart`,
          };
      }else {
        return {
            success: true,
            message: `${product.name} quantity updated in cart`,
        }
      }
  
      
    } catch (error) {
      return { success: false, message: formatError(error) };
    }
  }