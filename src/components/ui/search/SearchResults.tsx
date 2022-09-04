import React, { useEffect, useState } from 'react'
import { useDebounce } from 'src/hooks/useDebounce'
import { useAtom } from 'jotai'
import { truncate } from 'src/utils/truncate'
import { trackAtom, searchAtom, searchTermsAtom } from 'src/store/store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Track } from 'src/types/spotify'
import { useRouter } from 'next/router'
import { Portal } from 'react-portal'
import Modal from '../modal/Modal'
import Dropdown from '../forms/Dropdown'
import { DropdownEntry } from 'src/types/ui'
import { toast } from 'react-toastify'
import SearchResultItem from './SearchResultItem'

export default function SearchResults() {
  const [search] = useAtom(searchAtom)
  const [searchTerms] = useAtom(searchTermsAtom)
  const debouncedSearchTerms = useDebounce(searchTerms, 500)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const [track, setTrack] = useAtom(trackAtom)

  const [dropdownEntries, setDropdownEntries] = useState<
    DropdownEntry[] | null
  >(null)

  const router = useRouter()

  function handleClose() {
    setIsModalOpen(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedPlaylist(e.target.value)
  }

  const {
    data: resultsData,
    isLoading,
    isError,
  } = useQuery(
    ['searchSongs', debouncedSearchTerms],
    async () => {
      const res = await fetch(`/api/search?terms=${searchTerms}`)

      return res.json()
    },
    {
      enabled: !!debouncedSearchTerms,
    }
  )

  // add a track or open modal
  // depending on selected playlist or not
  function handleAddTrack(track: any) {
    if (selectedPlaylist) {
      // is playlist - meaning we can open
      addTrack.mutate(track)

      return
    }
    // is not in a playlist so open modal
    if (!isModalOpen) {
      setIsModalOpen(true)
      setTrack(track)
      return
    }
  }

  function handleCloseModalReset() {
    setIsModalOpen(false)
    setSelectedPlaylist(null)
  }

  const { data } = useQuery(['getPlaylists'], async () => {
    const res = await fetch('/api/playlists')

    return res.json()
  })

  useEffect(() => {
    if (!isModalOpen) {
      return
    }

    let toAdd: DropdownEntry[] = []

    for (const playlist of data.items) {
      toAdd.push({
        name: playlist.name,
        value: playlist.id,
      })
    }

    setDropdownEntries(toAdd)
  }, [data, isModalOpen])

  useEffect(() => {
    if (router.pathname.indexOf('/playlist/') > -1) {
      // find which one
      if (!router.query?.id) {
        return
      }

      setSelectedPlaylist(router.query.id.toString())
    } else {
      setSelectedPlaylist(null)
    }
  }, [router, data])

  const addTrack = useMutation(
    async (track: any) => {
      const res = await fetch(
        `/api/addToPlaylist?playlistId=${selectedPlaylist}&trackUri=${track.uri}`
      )
      return res.json()
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['getPlaylists'])
        queryClient.invalidateQueries(['getPlaylist'])

        if (selectedPlaylist && router.asPath.indexOf(selectedPlaylist) > -1) {
          queryClient.invalidateQueries(['getPlaylistItems'])
        }

        let updatedData = resultsData
        // remove the added track from results
        updatedData.tracks.items = resultsData.tracks.items.filter(
          (f: any) => f.uri !== variables.uri
        )

        queryClient.setQueryData(['searchSongs'], updatedData)

        setTrack(variables)
        // if you got rid of all the searched songs
        // then refetch
        if (resultsData?.tracks?.items?.length === 1) {
          queryClient.invalidateQueries(['searchSongs'])
        }

        toast(`${variables.name} successfully added to the playlist`)

        if (isModalOpen) {
          handleCloseModalReset()
        }
      },
    }
  )

  return (
    <>
      {search && debouncedSearchTerms && (
        <div className='results h-5/6 overflow-y-scroll mt-8'>
          {isLoading && <div className='text-center w-full'>loading...</div>}

          {resultsData && (
            <>
              {resultsData?.tracks?.items?.map((track: Track) => (
                <SearchResultItem
                  key={track.id}
                  track={track}
                  handleAddTrack={handleAddTrack}
                />
              ))}
            </>
          )}
          <Portal>
            <Modal
              modalTitle='Add to which playlist?'
              open={isModalOpen}
              handleClose={handleClose}
            >
              {dropdownEntries?.length && (
                <Dropdown
                  handleChange={handleChange}
                  id='playlist-select'
                  entries={dropdownEntries}
                />
              )}

              <div className='buttons mt-4 flex items-center justify-end gap-3'>
                <button
                  onClick={handleCloseModalReset}
                  className='rounded-full font-bold uppercase bg-gray-500 hover:bg-gray-600 text-white px-3 py-2'
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddTrack(track)}
                  className='rounded-full font-bold uppercase bg-green-500 hover:bg-green-600 text-black px-3 py-2'
                >
                  {addTrack.isLoading ? <>Adding...</> : <>Save</>}
                </button>
              </div>
            </Modal>
          </Portal>
        </div>
      )}
    </>
  )
}
