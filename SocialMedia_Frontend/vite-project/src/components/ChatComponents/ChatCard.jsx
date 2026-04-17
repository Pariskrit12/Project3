import React, { useState } from 'react'
import IndividualChat from './IndividualChat';

const ChatCard = ({image,username,messageSnip}) => {
  const[openChat,setOpenChat]=useState(false);
  return (
    <>
    <div onClick={()=>setOpenChat(true)} className='flex border border-[#E8D5C0] bg-[#FDF6EE] shadow-[0_2px_8px_rgba(164,57,25,0.08)] gap-3 items-center px-4 py-3 rounded-xl hover:shadow-[0_4px_16px_rgba(164,57,25,0.14)] hover:bg-[#FAF0E6] transition-all duration-200 cursor-pointer md:w-150'>
        <img className='h-14 w-14 shrink-0 aspect-square rounded-full object-cover border-2 border-[#A43919]' src={image} alt='image'/>
        <div className='flex flex-col gap-0.5'>
            <p className='font-semibold text-[#2C1A0E]'>{username}</p>
            <p className='text-sm text-[#B89880] line-clamp-1'>{messageSnip}</p>
        </div>
    </div>
    {openChat &&(
      <IndividualChat/>
    )}
    </>
  )
}

export default ChatCard