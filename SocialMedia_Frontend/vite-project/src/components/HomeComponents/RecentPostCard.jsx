import { Icon } from '@iconify/react'
import React from 'react'
import { truncateWords } from '../../utils/truncateWords';

const RecentPostCard = () => {
  const title = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, animi?";
  return (
    <div className='py-3 border-b border-[#E8D5C0] last:border-0'>
      <div className='flex justify-between gap-3'>
        <div className='flex flex-col gap-1.5 flex-1 min-w-0'>
          <div className='flex gap-1.5 items-center'>
            <Icon className='text-[#A43919] shrink-0' icon="bi:emoji-grin-fill" width="13" height="13" />
            <p className='text-xs font-semibold text-[#A43919]'>Football</p>
            <p className='text-xs text-[#B89880]'>· 2h ago</p>
          </div>
          <p className='font-bold text-sm text-[#2C1A0E] leading-snug'>
            {truncateWords(title, 5)}
          </p>
        </div>
        <div className='shrink-0'>
          <img src='./Sharbani.png' className='w-16 h-16 object-cover rounded-lg border border-[#E8D5C0]' />
        </div>
      </div>
      <div className='flex text-xs gap-3 text-[#B89880] mt-1.5'>
        <div className='flex items-center gap-1'>
          <Icon icon="boxicons:like-filled" width="11" height="11" />
          <p>191 likes</p>
        </div>
        <div className='flex items-center gap-1'>
          <Icon icon="mdi:comments" width="11" height="11" />
          <p>20 comments</p>
        </div>
      </div>
    </div>
  )
}

export default RecentPostCard
