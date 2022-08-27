import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState, useEffect, useRef } from 'react'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { trackAtom } from 'src/store/store'
import { useAtom } from 'jotai'

export default function PlaylistElement({ playlist }: { playlist?: any }) {
  const queryClient = useQueryClient()

  const [track] = useAtom(trackAtom)
  const [toHighlight, setToHighlight] = useState<any>(null)
  const container = useRef<HTMLDivElement>(null)

  const deleteTrack = useMutation(
    async (trackToRemove: string) => {
      return await fetch(
        `/api/track/remove?playlistId=${playlist.id}&trackUri=${trackToRemove}`
      )
    },
    {
      onSuccess: () => {
        toast('Track deleted successfully')
        queryClient.invalidateQueries(['getPlaylist'])
      },
    }
  )

  useEffect(() => {
    if (!track || !container.current) {
      return
    }

    // scroll to bottom
    container.current.scrollTop = container?.current?.scrollHeight

    setToHighlight(track)
    // remove highlight after delay
    const timer = setTimeout(() => {
      setToHighlight(null)
    }, 1000)
    return () => clearTimeout(timer)
  }, [track, container, playlist])

  /* eslint-disable @next/next/no-img-element */
  return (
    <div
      className='playlist-element-container bg-neutral-900/40'
      ref={container}
    >
      <ul>
        {playlist?.tracks?.items?.map((item: any, index: number) => (
          <li
            className={`p-4 ${
              toHighlight?.id === item?.track?.id
                ? `highlight ${item?.track?.id}`
                : ''
            } transition-all bg-neutral-900/60 flex items-center gap-3 hover:bg-green-900`}
            key={index}
          >
            <p>{index + 1}</p>
            <img
              src={item.track.album.images[0].url}
              className='w-10'
              alt={item.track.name}
            />
            <div className='track-name-artist'>
              <h4>{item.track.name}</h4>
              <h5 className='text-neutral-300 text-sm'>
                {item.track.artists.map((artist: any, index: number) => (
                  <div key={index}>
                    {index === 0 ? (
                      <span>
                        {artist.name}
                        {item.track.artists.length > 1 && (
                          <span className='text-neutral-400'>{' / '}</span>
                        )}
                      </span>
                    ) : (
                      <span className='text-neutral-400'>
                        {artist.name}
                        {item.track.artists.length > 2 &&
                          index !== item.track.artists.length - 1 && (
                            <span>{' / '}</span>
                          )}
                      </span>
                    )}
                  </div>
                ))}
              </h5>
            </div>
            <RiDeleteBin5Line
              onClick={() => deleteTrack.mutate(item.track.uri)}
              className='ml-auto text-gray-400 hover:text-red-600 cursor-pointer'
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
