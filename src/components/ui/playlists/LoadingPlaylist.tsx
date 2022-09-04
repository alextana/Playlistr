import React from 'react'

export default function LoadingPlaylist() {
  return (
    <div>
      <div
        className='skeleton mb-2'
        style={{ width: '300px', height: '26px' }}
      ></div>
      <div className='w-full playlist-skeleton bg-gray-800/80 playlist-element-container'>
        {Array(20)
          .fill('')
          .map(() => (
            <div
              className='element skeleton w-full block mb-2'
              style={{ height: '76px' }}
              key={Math.random()}
            ></div>
          ))}
      </div>
    </div>
  )
}
