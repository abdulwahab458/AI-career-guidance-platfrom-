import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className='flex justify-center pt-40'>
       <SignIn redirectUrl="/onboarding"/>
    </div>
  )
}

export default page
 