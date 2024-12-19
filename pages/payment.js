import React from 'react'
import Link from 'next/link'
import { IoHomeOutline } from "react-icons/io5";

const Payment = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='mt-44 text-5xl text-center mb-10'>
        Payment Functionality has not been Implemented yet !!!!
      </div>
      <div className="w-3/5 h-2/5">
        <Link href={'/'} className="text-white py-2 rounded-full font-bold flex justify-center items-center bg-[#0C82E7] text-xl md:text-5xl transition-transform hover:scale-105 h-32 md:h-64">
          <IoHomeOutline className='text-5xl font-extrabold mr-1'/><span>Go to Home</span>
        </Link>
      </div>
    </div>
  )
}

export default Payment
