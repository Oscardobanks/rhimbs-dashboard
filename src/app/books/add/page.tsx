import React from 'react'
import { FaHouse } from 'react-icons/fa6'
import Link from 'next/link'
import DashboardLayout from '@/app/components/DashboardLayout'
import BookForm from '@/app/components/BookForm'

const AddBooks = () => {
  return (
    <div>
      <DashboardLayout active="books">
        <div className="py-8 lg:px-8 px-5 lg:min-h-[91.8vh] min-h-[94vh] size-full bg-gray-50 text-black">
          <div className="flex gap-5 justify-between items-center">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-teal-900">Add Book</h1>
              <div className="flex gap-2 items-center text-sm">
                <Link href="/dashboard" className='pb-1'><FaHouse color='#9ca3af' /></Link> /
                <Link href="/books" className='text-gray-400 font-semibold'>books</Link> /
                <span className="text-gray-600 font-semibold">add</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-10">
            <BookForm />
          </div>
        </div>
      </DashboardLayout>
    </div>
  )
}

export default AddBooks
