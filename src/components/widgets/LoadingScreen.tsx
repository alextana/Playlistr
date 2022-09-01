import React from 'react'
import PuffLoader from 'react-spinners/PuffLoader'

export default function LoadingScreen() {
  return (
    <div className='h-screen w-screen grid place-content-center'>
      <PuffLoader color={'green'} />
    </div>
  )
}
