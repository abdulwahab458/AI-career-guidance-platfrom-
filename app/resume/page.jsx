import { getresume } from '@/actions/resume'
import ResumeBuilder from '@/components/ResumeBuilder';
import React from 'react'

const page = async() => {
    const resume = await getresume();
  return (
    <div className='p-6 max-w-5xl mt-15 mx-auto'>
      <ResumeBuilder  initialContent={resume?.content}/>
    </div>
  )
}

export default page
