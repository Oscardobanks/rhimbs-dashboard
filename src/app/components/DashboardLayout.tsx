'use client'
import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
    children: React.ReactNode;
    active: String
}
const DashboardLayout = ({ active, children }: LayoutProps) => {
    return (
        <div className='flex w-full h-screen'>
            <Sidebar active={active} />
            <div className='grow flex flex-col w-full overflow-y-auto scrollbar scrollbar-thumb-teal-500 scrollbar-track-teal-100'>
                <Header />
                <div className="lg:mt-0 mt-10">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
