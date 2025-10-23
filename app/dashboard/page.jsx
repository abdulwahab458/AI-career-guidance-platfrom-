import { getIndustryInsight } from '@/actions/dashboard';
import { getUserStatus } from '@/actions/user';
import Dashboardcomp from '@/components/Dashboardcomp';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const insights = await getIndustryInsight();


  const { isOnboarded } = await getUserStatus();
  if (!isOnboarded) {
    redirect('/onboarding');
  }
  return (
    <div className='container mx-auto  mt-20'>
      <Dashboardcomp insights={insights}/>
    </div>
  )
}

export default page
