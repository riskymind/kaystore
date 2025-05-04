import React from 'react'
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from "@/lib/constants"
import {auth} from "@/auth"
import {redirect} from "next/navigation"
import SignUpForm from './sign-up-form';

export const metadata: Metadata = {
    title: "Sign Up"
}

const SignUpPage = async (props: {
    searchParams: Promise<{callbackUrl: string}>
}) => {

    const {callbackUrl} = await props.searchParams

    const session = await auth()

    if(session) {
        return redirect(callbackUrl || "/")
    }

  return (
    <div className='w-full max-w-md mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
          <Link href='/' className='flex items-center justify-center'>
            <Image
              src='/images/logo.png'
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
            />
          </Link>
          <CardTitle className='text-center'>Sign Up</CardTitle>
          <CardDescription className='text-center'>
            Enter your information below to sign up
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage
