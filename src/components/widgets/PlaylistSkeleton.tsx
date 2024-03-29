import React from 'react'

export default function PlaylistSkeleton() {
  return (
    <>
      <div
        className='skeleton bg-gray-800/80 mb-2'
        style={{ width: '300px', height: '40px' }}
      ></div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'>
        {Array(20)
          .fill('')
          .map(() => (
            <div
              key={Math.random()}
              className='rounded-3xl skeleton bg-gray-800/80 hover:bg-gray-800/80 transform hover:-translate-y-1 transition-all p-4 w-full'
              style={{ width: '100%', height: '368px' }}
            >
              {''}
            </div>
          ))}
      </div>
    </>
  )
}
