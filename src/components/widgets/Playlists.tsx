import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import PlaylistSkeleton from './PlaylistSkeleton'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import Image from 'next/future/image'
import NoImage from '../ui/playlists/NoImage'
import Greeting from '../ui/greeting/Greeting'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useRouter } from 'next/router'
import Modal from '../ui/modal/Modal'
import { Portal } from 'react-portal'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Playlist() {
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const [show, setShow] = useState<boolean>(false)
  const [erroringImages, setErroringImages] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [playlist, setPlaylist] = useState<any>(null)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { isLoading, error, data } = useQuery(['getPlaylists'], async () => {
    const res = await fetch('/api/playlists')

    return res.json()
  })

  useEffect(() => {
    setShow(true)
  }, [data, show])

  function deletePlaylist(playlist: any) {
    setPlaylist(playlist)
  }

  function handleDeletePlaylist() {
    removePlaylist.mutate(playlist)
  }

  const removePlaylist = useMutation(
    async (playlist: any) => {
      const res = await fetch(`/api/delete-playlist?playlistId=${playlist.id}`)

      return res.json()
    },
    {
      onSuccess: () => {
        toast(`${playlist?.name} deleted successfully`)
        queryClient.invalidateQueries(['getPlaylists'])
        setIsModalOpen(false)
        setPlaylist(null)
      },
    }
  )

  function handleRoute(e: React.MouseEvent<HTMLDivElement>, playlist: any) {
    const target = e.target as HTMLDivElement

    if (
      target.classList.contains('delete-playlist') ||
      target.closest('.delete-playlist')
    ) {
      setPlaylist(playlist)
      setIsModalOpen(true)

      return
    }

    router.push(`${`/playlist/${playlist.id}`}`)
  }

  function handleCloseModalReset() {
    setIsModalOpen(false)
    setPlaylist(null)
  }

  function handleClose() {
    handleCloseModalReset()
  }

  function handleErroringImages(index: number) {
    setErroringImages((prevState) => [...prevState, index])
  }

  if (error) return <div>An error has occurred</div>

  if (isLoading) return <PlaylistSkeleton />

  return (
    <>
      <Greeting />
      <div ref={parent}>
        {show && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6'>
            {data && (
              <>
                {data?.items?.map((playlist: any, i: number) => (
                  <div
                    key={playlist.id}
                    role='link'
                    onClick={(e) => handleRoute(e, playlist)}
                    className='rounded-3xl cursor-pointer bg-gray-800/40 hover:bg-green-800/80 border border-gray-700/30 shadow-xl hover:border-green-700/50 transform hover:-translate-y-1 transition-all p-4 w-full'
                  >
                    {playlist?.images[0]?.url &&
                    !erroringImages.find((f) => f === i) ? (
                      <Image
                        width={250}
                        priority={true}
                        height={250}
                        src={playlist?.images[0]?.url || ''}
                        onError={() => handleErroringImages(i)}
                        className='rounded-xl w-full mb-4 shadow-2xl'
                        alt={playlist.name}
                        style={{ height: 'auto' }}
                      />
                    ) : (
                      <NoImage />
                    )}
                    <div className='info flex gap-1 justify-between items-center'>
                      <div className='name-count'>
                        <h2 className='text-md font-extrabold'>
                          {playlist.name}
                        </h2>
                        <h3 className='text-neutral-200'>
                          {playlist.tracks.total} tracks
                        </h3>
                      </div>
                      <div
                        className='delete-playlist cursor-pointer hover:text-green-500'
                        onClick={() => deletePlaylist(playlist)}
                      >
                        <RiDeleteBin6Line className='w-5 h-5' />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            <Portal>
              <Modal
                modalTitle='Remove playlist'
                open={isModalOpen}
                handleClose={handleClose}
              >
                <h4 className='text-neutral-800'>
                  Are you sure you want to delete the playlist? This action
                  cannot be undone
                </h4>
                <div className='buttons mt-4 flex items-center justify-end gap-3'>
                  <button
                    onClick={handleCloseModalReset}
                    className='rounded-full font-bold uppercase bg-gray-500 hover:bg-gray-600 text-white px-3 py-2'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeletePlaylist}
                    className='rounded-full font-bold uppercase bg-green-500 hover:bg-green-600 text-black px-3 py-2'
                  >
                    {removePlaylist.isLoading ? <>Deleting...</> : <>Delete</>}
                  </button>
                </div>
              </Modal>
            </Portal>
          </div>
        )}
      </div>
    </>
  )
}
