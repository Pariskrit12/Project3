import React, { useState } from 'react'
import IndividualChat from './IndividualChat';

const ChatCard = ({image, username, messageSnip}) => {
  const [openChat, setOpenChat] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpenChat(true)}
        className='flex gap-3 items-center px-3 py-2.5 rounded-xl hover:bg-[#F4D9C6] transition-all duration-200 cursor-pointer'
      >
        <div className='relative shrink-0'>
          <img className='h-11 w-11 aspect-square rounded-full object-cover border-2 border-[#A43919]' src={image} alt='avatar' />
          <div className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#FEF7ED]'></div>
        </div>
        <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
          <p className='font-semibold text-sm text-[#2C1A0E]'>{username}</p>
          <p className='text-xs text-[#B89880] line-clamp-1'>{messageSnip}</p>
        </div>
        <span className='text-xs text-[#B89880] shrink-0'>2h</span>
      </div>
    </>
  )
}

export default ChatCard
