import { Icon } from '@iconify/react'
import React from 'react'
import { truncateWords } from '../../utils/truncateWords';
const RecentPostCard = () => {
  const title="Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, animi?";
  return (
    <div className='border-b border-gray-400 py-1'>

    <div className='flex justify-between'>
        <div className='flex flex-col gap-2'>
        <div className='flex gap-1 items-center'>
        <Icon className='text-[#A43919]' icon="bi:emoji-grin-fill" width="18" height="18" />
        <p className='text-sm'>Football</p>
        <p className='text-sm'>2 hours ago</p>
        </div>
        <div className='font-bold'>
            {truncateWords(title,5)}
        </div>
        </div>
        <div className='shrink-0'>
            <img src='./Sharbani.png' className='w-20 h-20 object-cover rounded-lg'/>
        </div>
    </div>
    <div className='flex text-sm gap-2 text-gray-500'>
        <p>191 likes</p>
        <p>20 comments</p>
    </div>
    </div>
  )
}

export default RecentPostCard