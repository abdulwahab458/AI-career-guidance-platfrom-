import { getIndustryInsight } from '@/actions/dashboard';
import { getUserStatus } from '@/actions/user';
import Dashboardcomp from '@/components/Dashboardcomp';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const { isOnboarded, dbUnavailable } = await getUserStatus();
  if (dbUnavailable || !isOnboarded) {
    redirect('/onboarding');
  }

  const insights = await getIndustryInsight();
  if (!insights) {
    redirect('/onboarding');
  }

  return (
    <div className='container mx-auto  mt-20'>
      <Dashboardcomp insights={insights}/>
    </div>
  )
}

export default page
