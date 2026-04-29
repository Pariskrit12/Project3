import React from 'react'
import IconLink from '../components/common/IconLink'
import NotificationCard from '../components/Notifications/NotificationCard'

const Notification = () => {
  return (
    <main className='grid grid-cols-1 gap-4'>
      <section className="flex justify-between items-center">
        <h1 className='font-bold text-2xl text-[#2C1A0E]'>Notifications</h1>
        <div className='flex gap-3 items-center'>
          <span className='text-sm text-[#AF503A] font-medium cursor-pointer hover:text-[#A43919] transition-colors'>Mark all as read</span>
          <div className='h-4 w-px bg-[#E8D5C0]'></div>
          <IconLink icon="material-symbols:settings-rounded" />
        </div>
      </section>

      <section className='grid grid-cols-1 gap-3'>
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
      </section>
    </main>
  )
}

export default Notification
