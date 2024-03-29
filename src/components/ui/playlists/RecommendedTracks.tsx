import React from 'react'
import { RiAddCircleLine } from 'react-icons/ri'
import { useMutation, useQueryClient, QueryCache } from '@tanstack/react-query'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { trackAtom } from 'src/store/store'
import { useAtom } from 'jotai'
import Image from 'next/future/image'
import { toast } from 'react-toastify'

export default function RecommendedTracks({
  recommendations,
  playlist,
}: {
  recommendations: any
  playlist: any
}) {
  const [recommendedTracks] = useAutoAnimate<any>()
  const [, setTrack] = useAtom(trackAtom)
  const queryClient = useQueryClient()

  const addTrack = useMutation(
    async (track: any) => {
      const res = await fetch(
        `/api/addToPlaylist?playlistId=${playlist}&trackUri=${track.uri}`
      )
      return res.json()
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['getPlaylistItems'])
        toast.success(`${variables.name} successfully added to the playlist`)
        queryClient.invalidateQueries(['getPlaylist'])
        // remove the added track from recommended
        setTrack(variables)
        // if you got rid of all the recommendations
        // then refetch
        if (recommendations.tracks.length === 1) {
          queryClient.invalidateQueries(['getRecommended'])
        }
      },
      onMutate: (variables) => {
        queryClient.setQueryData(['getRecommended'], {
          seeds: recommendations.seeds,
          tracks: recommendations.tracks.filter(
            (f: any) => f.uri !== variables.uri
          ),
        })

        let oldData: any = queryClient
          .getQueryCache()
          .find(['getPlaylistItems'], { exact: false })?.state?.data

        oldData?.pages[oldData.pages.length - 1]?.items?.push({
          type: 'loading',
        })

        queryClient.setQueryData(['getPlaylistItems'], oldData)
      },
      onError: (_, variables) => {
        toast.error(`There was an issue adding ${variables.name}`)
      },
    }
  )

  const handleAddToPlaylist = (track: any) => {
    addTrack.mutate(track)
  }

  return (
    <div
      ref={recommendedTracks}
      className='playlist-element-container bg-gray-800/40'
    >
      <ul>
        {recommendations?.tracks?.map((item: any, index: number) => (
          <li
            className='bg-gray-800/40 p-4 flex items-center gap-3 hover:bg-green-900'
            key={item.uri}
          >
            <p>{index + 1}</p>
            {item.album.images[0].url ? (
              <Image
                width={40}
                height={40}
                src={item.album.images[0].url}
                className='w-10'
                sizes='(min-width: 1px) 40px'
                alt={item.name}
              />
            ) : (
              <div
                className='bg-gray-900'
                style={{ width: '40px', height: '40px' }}
              ></div>
            )}
            <div className='track-name-artist'>
              <h4>{item.name}</h4>
              <h5 className='text-neutral-300 text-sm'>
                {item.artists.map((artist: any, index: number) => (
                  <span key={index}>
                    {index === 0 ? (
                      <span>
                        {artist.name}
                        {item.artists.length > 1 && (
                          <span className='text-neutral-400'>{' / '}</span>
                        )}
                      </span>
                    ) : (
                      <span className='text-neutral-400'>
                        {artist.name}
                        {item.artists.length > 2 &&
                          index !== item.artists.length - 1 && (
                            <span>{' / '}</span>
                          )}
                      </span>
                    )}
                  </span>
                ))}
              </h5>
            </div>
            <div className='ml-auto' style={{ minWidth: '16px' }}>
              <RiAddCircleLine
                onClick={() => handleAddToPlaylist(item)}
                className='text-gray-400 hover:text-green-600 cursor-pointer'
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
