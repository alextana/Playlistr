import React from 'react'

export default function Logo({
  showAlpha = true,
  extraClass,
}: {
  showAlpha?: boolean
  extraClass?: string
}) {
  return (
    <div
      className={`${extraClass} flex gap-1 items-center  cursor-pointer logo-group hover:text-green-500`}
    >
      <div className='logo-icon transform rotate-x-90'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' />
        </svg>
      </div>
      <div className='logo-name relative'>
        <span className='font-extrabold italic tracking-tighter text-xl my-0'>
          playlistr
        </span>
        {showAlpha && (
          <span className='italic text-gray-400 font-bold text-xs -top-1 ml-1 rounded-full'>
            ALPHA
          </span>
        )}
      </div>
    </div>
  )
}
