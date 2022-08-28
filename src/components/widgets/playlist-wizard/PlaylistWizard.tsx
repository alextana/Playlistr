import React, { useEffect, useState } from 'react'
import Head from 'next/head'

import type { Purpose } from './types'
import { playlistPurposes } from './purposes'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useSpring, animated } from 'react-spring'

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'
export default function PlaylistWizard() {
  const [playlistName, setplaylistName] = useState<string>('')
  const [selectedPurpose, setSelectedPurpose] = useState<Purpose | null>(null)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [pickGenres, setPickGenres] = useState<boolean>(false)
  const [trackNumber, setTrackNumber] = useState<number | null>(null)

  const [show, setShow] = useState<boolean>(false)

  const [playlistState, setPlaylistState] = useState<string | null>('')
  const [parent] = useAutoAnimate<HTMLDivElement>()

  const genreStyles = useSpring({
    opacity: pickGenres ? 1 : 0,
    y: pickGenres ? 0 : 400,
  })

  const trackNumberStyles = useSpring({
    opacity: selectedPurpose ? 1 : 0,
  })

  const { data: session } = useSession()

  const router = useRouter()

  useEffect(() => {
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: ' ',
      length: 3,
    })
    setplaylistName(randomName)
  }, [])

  useEffect(() => {
    setShow(true)
  }, [show])

  const trackNumbers = [5, 10, 20, 30, 40, 60, 80, 100]

  const { data: genres } = useQuery(
    ['getGenres', selectedPurpose],
    async () => {
      const res = await fetch(`/api/genres`)

      return res.json()
    }
  )

  function handleSelectedGenre(genre: string) {
    if (selectedGenres.find((f: string) => f === genre)) {
      const updatedGenre = selectedGenres.filter((g: string) => g !== genre)
      setSelectedGenres(updatedGenre)

      return
    }

    if (selectedGenres.length === 3) {
      return
    }

    const updatedGenres = [...selectedGenres, genre]
    setSelectedGenres(updatedGenres)
  }

  function handleTrackNumber(number: number) {
    if (number === trackNumber) {
      setTrackNumber(null)

      return
    }

    setTrackNumber(number)
  }

  const createPlaylist = useMutation(
    async () => {
      setPlaylistState('loading')

      const playlist_name = `playlist_name=${playlistName}`
      const params = new URLSearchParams(playlist_name)
      const user_id: string | undefined = session?.user?.id
      const seeds: any = selectedPurpose?.seeds

      let seedString: string | null = null
      let seedGenres: string | null = null

      if (user_id) {
        params.set('user_id', user_id)
      }

      if (trackNumber) {
        params.set('limit', trackNumber.toString())
      }

      if (seeds) {
        seedString =
          '&' +
          Object.keys(seeds)
            .map((key) => key + '=' + seeds[key])
            .join('&')
            .toString()
      }

      if (selectedGenres.length) {
        seedGenres = '&seed_genres=' + selectedGenres.join(',')
      }

      return await fetch(
        `/api/create-playlist?${params}` + seedString + seedGenres
      )
    },
    {
      onSuccess: async (data: any) => {
        const playlist = await data.json()
        setPlaylistState('done')

        if (playlist) {
          router.push(`/playlist/${playlist.id}`)
        }
      },
      onError: async () => {
        setPlaylistState('error')
      },
    }
  )

  return (
    <>
      <Head>
        <title>Playlistr | Create New Playlist</title>
      </Head>
      <div ref={parent}>
        {show && (
          <div className='transition-all bg-neutral-900/80 p-6 rounded-3xl mt-2'>
            <div className='playlist-name'>
              <h4 className='mb-2 tracking-tighter text-xs font-extrabold uppercase'>
                Playlist name
              </h4>
              <input
                className='bg-neutral-600/80 w-full md:w-80 text-xl rounded-2xl px-4 py-2 focus:outline-1 outline-green-500'
                type='text'
                value={playlistName}
                onChange={(e) => setplaylistName(e.target.value)}
              ></input>
            </div>
            <div className='wizard-form w-full'>
              <div className='title text-center mt-4 mb-8 text-gray-300 text-2xl'>
                <h4>What{`'`}s the purpose of the playlist?</h4>
              </div>
              <div className='playlist-purposes mb-8 mt-4 flex flex-wrap gap-3 justify-center'>
                {playlistPurposes.map((purpose) => (
                  <div
                    onClick={() => setSelectedPurpose(purpose)}
                    key={purpose.id}
                    className={`${
                      selectedPurpose?.id === purpose.id
                        ? 'bg-green-600/80 hover:bg-green-800/80'
                        : 'bg-neutral-700/20 hover:bg-neutral-600/60'
                    } playlist-purpose-item cursor-pointer  rounded-md p-4 w-36 text-center text-sm uppercase font-semibold`}
                  >
                    <div className='purpose-icon text-4xl mb-2'>
                      {purpose.icon}
                    </div>
                    <div className='purpose-name'>{purpose.name}</div>
                  </div>
                ))}
              </div>

              {selectedPurpose && (
                <>
                  <animated.div
                    style={trackNumberStyles}
                    className='select-track-number text-center mt-4 mb-4 text-gray-300 text-2xl'
                  >
                    <h4>How many tracks would you like to add?</h4>
                    <div className='track-numbers mt-4 flex gap-3 justify-center flex-wrap'>
                      {trackNumbers.map((number: number) => (
                        <div
                          onClick={() => handleTrackNumber(number)}
                          key={number}
                          className={` ${
                            trackNumber === number
                              ? 'bg-green-600/80 hover:bg-green-800/80'
                              : 'bg-neutral-800/80 hover:bg-neutral-600/80'
                          }  cursor-pointer w-20 rounded-md px-4 py-2 text-sm font-extrabold`}
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                  </animated.div>

                  <div className='select-genre text-center relative'>
                    {genres && pickGenres && (
                      <animated.div style={genreStyles}>
                        <div className='info-text sticky top-0 backdrop-blur-lg py-4'>
                          <h4 className='text-2xl text-gray-200'>
                            Select up to 3 genres (or none if you don{`'`}t
                            care)
                          </h4>
                          <h5 className='text-gray-400 text-sm'>
                            if you don{`'`}t select a genre we will guess tracks
                            based on your top artists
                          </h5>
                        </div>
                        <div className='genres my-4'>
                          <div className='flex gap-3 relative justify-center flex-column flex-wrap w-full'>
                            {genres?.map((genre: string) => (
                              <div
                                key={genre}
                                onClick={() => handleSelectedGenre(genre)}
                                className={`
                    ${
                      selectedGenres.filter((f: string) => f === genre).length
                        ? 'selected'
                        : 'border-transparent'
                    } border playlist-purpose-item cursor-pointer bg-neutral-600/30 hover:bg-green-600 border-white rounded-md p-2 text-center text-xs uppercase font-semibold`}
                              >
                                {genre}
                              </div>
                            ))}
                          </div>
                        </div>
                      </animated.div>
                    )}
                    <div className='pre-selection mt-8'>
                      {!pickGenres && (
                        <>
                          <button
                            onClick={() => setPickGenres(true)}
                            className='mx-auto block create-playlist bg-neutral-600 hover:bg-neutral-700 cursor-pointer uppercase text-sm font-bold rounded-full justify-center px-9 py-2 w-max text-center'
                          >
                            select up to 3 Genres
                          </button>
                          <div className='or-text py-2 my-0 text-xs font-extrabold tracking-tighter'>
                            OR
                          </div>
                        </>
                      )}
                      <button
                        onClick={() => createPlaylist.mutate()}
                        className={`
                    ${
                      playlistState === 'loading'
                        ? 'bg-neutral-600 hover:bg-neutral-600 pointer-events-none'
                        : 'bg-green-600'
                    }
                    ${
                      playlistState === 'error'
                        ? 'bg-red-300 hover:bg-red-400 pointer-events-none'
                        : 'bg-green-600'
                    }
                  mx-auto block create-playlist  hover:bg-green-700 cursor-pointer uppercase text-sm font-bold rounded-full justify-center px-9 py-2 w-max text-center`}
                      >
                        {playlistState === 'loading' ? (
                          <>Loading...</>
                        ) : (
                          <>Create Playlist</>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
