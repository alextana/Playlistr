import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState, useEffect, useRef } from 'react'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { trackAtom } from 'src/store/store'
import { useAtom } from 'jotai'
import Image from 'next/future/image'
import NoImage from './NoImage'

export default function PlaylistElement({
  playlistId,
  playlist,
  fetchNextPage,
  hasNextPage,
}: {
  playlistId?: string | string[] | undefined
  playlist?: any
  fetchNextPage: Function
  hasNextPage: boolean | undefined
}) {
  const queryClient = useQueryClient()

  const [track] = useAtom(trackAtom)
  const [toHighlight, setToHighlight] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const container = useRef<HTMLDivElement>(null)

  const deleteTrack = useMutation(
    async (trackToRemove: string) => {
      return await fetch(
        `/api/track/remove?playlistId=${playlistId}&trackUri=${trackToRemove}`
      )
    },
    {
      onSuccess: () => {
        toast('Track deleted successfully')
        queryClient.invalidateQueries(['getPlaylistItems'])
      },
    }
  )

  function handleScrolling() {
    if (!container.current || !playlist || !hasNextPage) {
      return
    }

    if (container.current.scrollTop > container.current.scrollHeight - 2000) {
      if (playlist.pages[currentPage]?.items?.length === 100) {
        fetchNextPage({ pageParam: 100 * (currentPage + 1) })
        setCurrentPage(currentPage + 1)
      }
    }
  }

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
      onScroll={handleScrolling}
      className='playlist-element-container bg-gray-800/40'
      ref={container}
    >
      {playlist.pages[0]?.items?.length ? (
        <ul>
          {playlist.pages.map((group: any, i: number) => (
            <React.Fragment key={i}>
              {group.items?.map((item: any, index: number) => (
                <React.Fragment key={index}>
                  {item?.type === 'loading' ? (
                    <li
                      className='element skeleton w-full block mb-2'
                      style={{ height: '76px' }}
                    ></li>
                  ) : (
                    <li
                      className={`p-4 ${
                        toHighlight?.id === item?.track?.id
                          ? `highlight ${item?.track?.id}`
                          : ''
                      } transition-all bg-gray-800/40 flex items-center gap-3 hover:bg-green-900`}
                      key={index}
                    >
                      {/* set correct index depending on page */}
                      {i + 1 >= 2 ? (
                        <p>{index + 1 * (i * 100) + 1}</p>
                      ) : (
                        <p>{index + 1}</p>
                      )}
                      {item?.track?.album?.images[0]?.url ? (
                        <Image
                          width={40}
                          height={40}
                          src={item?.track?.album?.images[0]?.url || ''}
                          className='w-10'
                          sizes='(min-width: 1px) 40px'
                          alt={item.track.name}
                        />
                      ) : (
                        <div
                          className='bg-gray-900'
                          style={{ width: '40px', height: '40px' }}
                        ></div>
                      )}
                      <div className='track-name-artist'>
                        <h4>{item.track.name}</h4>
                        <h5 className='text-neutral-300 text-sm'>
                          {item.track.artists.map(
                            (artist: any, index: number) => (
                              <span key={index}>
                                {index === 0 ? (
                                  <span>
                                    {artist.name}
                                    {item.track.artists.length > 1 && (
                                      <span className='text-neutral-400'>
                                        {' / '}
                                      </span>
                                    )}
                                  </span>
                                ) : (
                                  <span className='text-neutral-400'>
                                    {artist.name}
                                    {item.track.artists.length > 2 &&
                                      index !==
                                        item.track.artists.length - 1 && (
                                        <span>{' / '}</span>
                                      )}
                                  </span>
                                )}
                              </span>
                            )
                          )}
                        </h5>
                      </div>
                      <RiDeleteBin5Line
                        onClick={() => deleteTrack.mutate(item.track.uri)}
                        className='ml-auto text-gray-400 hover:text-red-600 cursor-pointer'
                      />
                    </li>
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <div
          style={{ minHeight: '300px' }}
          className='grid p-3 place-content-center text-center'
        >
          <h2 className='text-5xl font-extrabold tracking-tighter'>Woah!</h2>
          <h3 className='text-xl text-gray-400'>
            There are no tracks in this playlist!
          </h3>
          <h4 className='text-md text-gray-400'>
            You can add them using the recommendations or the search feature
          </h4>
        </div>
      )}
    </div>
  )
}
