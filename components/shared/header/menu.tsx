import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {UserIcon, ShoppingCart} from "lucide-react"
import { ThemeSwitch } from './theme-switch'


const Menu = () => {
  return (
    <div className='flex justify-end items-center gap-2'>
      <nav className='hidden md:flex w-full gap-1 max-w-xs'>
        <ThemeSwitch />
        <Button asChild variant='ghost'>
            <Link href="/cart" className='flex items-center gap-2'>
            <ShoppingCart /> Cart
            </Link>
        </Button>
        <Button>
            <Link href="/sign-in" className='flex items-center gap-2'>
                <UserIcon /> Sign In
            </Link>
        </Button>
      </nav>
    </div>
  )
}

export default Menu
