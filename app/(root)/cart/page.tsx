import { getCart } from '@/lib/actions/cart.actions'
import React from 'react'
import CartTable from './cart.table'

export const metadata = {
    title: "shopping Cart"
}

const CartPage = async () => {
    const cart = await getCart()
  return (
    <>
      <CartTable cart={cart}/>
    </>
  )
}

export default CartPage
