import React from 'react'
import { Track } from 'src/types/spotify'
import Image from 'next/future/image'
import { truncate } from 'src/utils/truncate'

export default function SearchResultItem({
  track,
  handleAddTrack,
}: {
  track: Track
  handleAddTrack: Function
}) {
  return (
    <div
      className={`track px-4 py-3 hover:bg-green-900 flex gap-3 items-center`}
    >
      <div className='track-album-image'>
        <Image
          width={40}
          height={40}
          className='w-8 h-8'
          src={track.album.images[0]?.url || ''}
          alt={track.album.name}
        />
      </div>
      <div className='track-name text-sm'>
        {truncate(track.name, 30)}
        <span className={`block artist-name text-xs`}>
          {track.artists.map((artist: any, index: number) => (
            <span
              key={artist.id}
              className={`${index !== 0 ? 'text-gray-400' : 'text-gray-300'}`}
            >
              {index !== 0 ? '/ ' : ''}
              {truncate(artist.name, 40)}
            </span>
          ))}
        </span>
      </div>
      <div className='actions flex gap-3 justify-end ml-auto items-center'>
        <div onClick={() => handleAddTrack(track)}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 hover:text-green-500 cursor-pointer'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
