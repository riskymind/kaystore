"use server"
import {prisma} from "@/db/prisma"
import { convertToPlainObject } from "../utils"

// Get Latest products
export async function getLatestProudcts() {
    const data = await prisma.product.findMany({
        take: 4,
        orderBy: {createdAt: "desc"}
    })

    return convertToPlainObject(data)
}

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: {slug: slug}
    })
}

// Get single product by it's ID
export async function getProsuctById(productId: string) {
    const data =  await prisma.product.findFirst({
        where: {id: productId}
    })

    return convertToPlainObject(data)
}