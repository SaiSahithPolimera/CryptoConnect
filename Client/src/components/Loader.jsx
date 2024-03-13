import React from 'react'

const Loader = () => {
  return (
    <div className='flex justify-center items-center py-3'>

      <div className='animate-spin rounded-full border-b-2 h-32 w-32 border-red-700'/>
    </div>
  )
}

export default Loader