import React from 'react'
import IconLink from '../components/common/IconLink'
import NotificationCard from '../components/Notifications/NotificationCard'

const Notification = () => {
  return (
   <main className='grid grid-cols-1 gap-3'>
    <section>
        <h1 className='font-bold text-2xl'>Notificatons</h1>
    </section>
    <section>
        <div className='flex gap-2 justify-self-end items-center '>
            <span>Mark all as read</span>
            <div className='border h-4'></div>
            <IconLink icon="material-symbols:settings-rounded" />
        </div>
    </section>
    <section className='grid grid-cols-1 gap-3'>
        <NotificationCard/>
        <NotificationCard/>
        <NotificationCard/>
    </section>
   </main>
  )
}

export default Notification