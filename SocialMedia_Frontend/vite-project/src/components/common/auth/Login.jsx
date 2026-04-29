import React from 'react'
import Input from '../Input'
import Button from '../Button'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();

  return (
    <form className='flex justify-center items-center h-150'>
      <div className='w-96 rounded-2xl p-8 flex flex-col gap-5 items-center bg-[#FEF7ED] shadow-[0_8px_32px_rgba(164,57,25,0.15)] border border-[#E8D5C0]'>
        <div className='flex flex-col items-center gap-2'>
          <div className='bg-linear-to-br from-[#AF503A] to-[#A43919] p-4 rounded-2xl shadow-[0_4px_12px_rgba(164,57,25,0.3)]'>
            <Icon icon="solar:login-bold" width="32" height="32" className='text-white' />
          </div>
          <h1 className='text-2xl font-bold text-[#2C1A0E]'>Welcome back</h1>
          <p className='text-sm text-[#B89880]'>Sign in to your account</p>
        </div>
        <div className='w-full flex flex-col gap-3'>
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
        </div>
        <div className='w-full'>
          <Button name="Login" isActive={true} />
        </div>
        <p className='text-sm text-[#5C4033]'>Not Registered? <span onClick={() => navigate("/register")} className='text-[#AF503A] font-semibold cursor-pointer hover:text-[#A43919]'>Create an Account</span></p>
      </div>
    </form>
  )
}

export default Login
