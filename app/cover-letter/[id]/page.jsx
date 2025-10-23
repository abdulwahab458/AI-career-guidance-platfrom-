import React from 'react'

const page = async ({params}) => {
    const id = await params.id
  return (
    <div className='mt-100'>
      this is the id {id}
    </div>
  )
}

export default page
