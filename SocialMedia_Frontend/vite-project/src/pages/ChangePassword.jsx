import { Icon } from '@iconify/react'
import React, { useActionState } from 'react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'

const ChangePassword = () => {
    const navigate=useNavigate();
  return (
    <main>
        <div className='flex w-70 justify-between items-center font-bold gap-3'>
            <Icon onClick={()=>navigate('/settings')} icon="tabler:arrow-left" width="30" height="30" className='cursor-pointer'/>
            <h1 className='text-2xl'>Change Password</h1>
        </div>
        <section className='pt-4'>
            <form className='w-100 flex flex-col gap-5  '>
                <div className=''>

                <Input type="password" placeholder="Current password"/>
                <p className='text-blue-700 text-sm px-3'>Forgot password?</p>
                </div>
                <div className='flex flex-col gap-4'>

                <Input type="password" placeholder="New password"/>
                <Input type="password" placeholder="Confirm password"/>
                </div>
                <div className='flex justify-between'>

               <Button isActive={true} name="Save"/>
                </div>
            </form>
        </section>
    </main>
  )
}

export default ChangePassword