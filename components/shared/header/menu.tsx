import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {ShoppingCart, EllipsisVertical} from "lucide-react"
import { ThemeSwitch } from './theme-switch'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import UserButton from './user-button'


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
        <UserButton />
      </nav>
      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger className='align-middle'>
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className='flex flex-col items-start'>
            <SheetTitle className='m-4 border-b'>Menu</SheetTitle>
            <ThemeSwitch />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
