import { getUserStatus } from '@/actions/user'
import OnboardingForm from '@/components/OnboardingForm'
import { industries } from '@/data/industries'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
   const {isOnboarded }= await getUserStatus();
   if(isOnboarded){
    redirect('/dashboard');
   }


  return (
    <div className='mt'>
      <OnboardingForm industries={industries}/> 
      

    </div>
  )
}

export default page
