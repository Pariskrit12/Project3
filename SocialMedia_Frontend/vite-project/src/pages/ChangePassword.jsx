import { Icon } from '@iconify/react'
import React, { useActionState } from 'react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'

const ChangePassword = () => {
  const navigate = useNavigate();
  return (
    <main className="max-w-lg">
      <div className='flex items-center gap-3 mb-6'>
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-xl hover:bg-[#F4D9C6] transition-colors text-[#2C1A0E] cursor-pointer"
        >
          <Icon icon="tabler:arrow-left" width="24" height="24" />
        </button>
        <h1 className='text-2xl font-bold text-[#2C1A0E]'>Change Password</h1>
      </div>

      <div className="bg-[#FDF6EE] border border-[#E8D5C0] rounded-2xl p-6">
        <form className='flex flex-col gap-5'>
          <div className='flex flex-col gap-1.5'>
            <label className="text-sm font-semibold text-[#5C4033]">Current Password</label>
            <Input type="password" placeholder="Enter current password" />
            <p className='text-blue-600 text-xs font-medium px-1 cursor-pointer hover:text-blue-700'>Forgot password?</p>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-1.5'>
              <label className="text-sm font-semibold text-[#5C4033]">New Password</label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div className='flex flex-col gap-1.5'>
              <label className="text-sm font-semibold text-[#5C4033]">Confirm Password</label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
          </div>
          <div>
            <Button isActive={true} name="Save" />
          </div>
        </form>
      </div>
    </main>
  )
}

export default ChangePassword
