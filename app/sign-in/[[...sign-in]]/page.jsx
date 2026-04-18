import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className='flex justify-center pt-40'>
       <SignIn forceRedirectUrl="/onboarding" />
    </div>
  )
}

export default page
 