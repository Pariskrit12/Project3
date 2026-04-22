import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
const NavigationLink = ({icon,label,onClick,isActive,path}) => {
    const bgColor = isActive 
    ? "bg-[#F4D9C6] text-[#A43919]"   // active
    : "";           // default hover

  return (
    <Link to={path} onClick={onClick} className={`flex  gap-4 items-center  py-2 px-2 ${bgColor} hover:bg-[#F4D9C6]`}>
        <Icon className="text-[#AF503A]" icon={icon} width="24" height="24" />
        <span>{label}</span>
      </Link>
  )
}

export default NavigationLink