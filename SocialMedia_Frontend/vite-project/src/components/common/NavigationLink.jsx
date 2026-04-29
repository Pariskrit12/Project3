import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'

const NavigationLink = ({icon, label, onClick, isActive, path}) => {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex gap-3 items-center py-2.5 px-3 rounded-xl transition-all duration-200 font-medium ${
        isActive
          ? "bg-[#A43919] text-white shadow-[0_2px_8px_rgba(164,57,25,0.2)]"
          : "text-[#2C1A0E] hover:bg-[#F4D9C6] hover:text-[#A43919]"
      }`}
    >
      <Icon
        icon={icon}
        width="20"
        height="20"
        className={isActive ? "text-white" : "text-[#AF503A]"}
      />
      <span className="text-sm">{label}</span>
    </Link>
  )
}

export default NavigationLink