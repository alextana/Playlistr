import React from 'react'
import Logo from '../logo/Logo'

export default function NoImage() {
  return (
    <div
      className='mb-4 text-green-500/50 bg-neutral-900 text-center grid place-content-center rounded-2xl'
      style={{ width: '100%', height: 'auto', minHeight: '250px' }}
    >
      <Logo extraClass='mx-auto' showAlpha={false} />
      <p>No image available</p>
    </div>
  )
}
