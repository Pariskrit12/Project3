import React from 'react'
import Input from '../Input'
import Button from '../Button'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const navigate=useNavigate();


  return (
    <form className='flex justify-center items-center h-150  '>
        
        <div className='w-100  rounded-xl p-4 flex flex-col gap-4 items-center bg-[#FEF7ED] shadow-[0_9px_12px_rgba(164,57,25,0.14)]'>
          <h1 className='text-3xl font-bold'>Login</h1>
          <Icon icon="solar:login-bold" width="60" height="60" className='text-[#AF503A]'/>
            <Input placeholder="Email" type="email"/>
            <Input placeholder="Password" type="password"/>
            <Button name="Login" />
            
            <p>Not Registered?<span onClick={()=>navigate("/register")} className='text-blue-700 cursor-pointer'>Create an Account</span></p>
        </div>
    </form>
  )
}

export default Login