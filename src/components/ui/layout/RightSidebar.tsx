import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import autoAnimate from '@formkit/auto-animate'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { BsSearch } from 'react-icons/bs'
import { HiOutlineMusicNote } from 'react-icons/hi'
import { searchAtom } from 'src/store/store'
import { useAtom } from 'jotai'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import Search from 'src/components/ui/search/Search'
import SearchResults from '../search/SearchResults'

export default function RightSidebar() {
  const router = useRouter()

  const [search, setSearch] = useAtom(searchAtom)
  const [, setSelectedPlaylist] = useState<string | null>(null)
  const [aside] = useAutoAnimate<HTMLDivElement>()

  useEffect(() => {
    aside.current && autoAnimate(aside.current)
  }, [aside])

  const { data } = useQuery(['getPlaylists'], async () => {
    const res = await fetch('/api/playlists')

    return res.json()
  })

  // set selected playlist if on a playlist page
  useEffect(() => {
    if (router.pathname.indexOf('/playlist/') > -1) {
      // find which one
      if (!router.query?.id) {
        return
      }

      setSelectedPlaylist(router.query.id.toString())
    }
  }, [router, data])

  return (
    <aside
      ref={aside}
      className={`w-80 transition-all ${
        search ? 'xl:w-96' : 'xl:w-72'
      } p-4 sticky top-5 rounded-3xl bg-neutral-900/80 h-screen overflow-y-hidden pb-8`}
    >
      <div className='links text-md font-semibold'>
        <Link href='/create-playlist'>
          <a className='cursor-pointer hover:text-green-500'>
            <div className='flex gap-3 items-center mb-4'>
              <HiOutlineMusicNote className='w-5 h-5' />
              Create new playlist
            </div>
          </a>
        </Link>
        {!search ? (
          <div
            className='sticky top-0 flex cursor-pointer hover:text-green-500 gap-3 items-center'
            onClick={() => setSearch(!search)}
          >
            <BsSearch className='w-5 h-5' />
            <h3>Search songs</h3>
          </div>
        ) : (
          <div className='flex gap-3 items-center'>
            <Search />
          </div>
        )}
      </div>

      {router.pathname.indexOf('/playlist/') > -1 && !search && (
        <>
          <span
            className='block w-full bg-white/30 my-2'
            style={{ height: '1px' }}
          />
          <ul>
            {data?.items?.map((playlist: any) => (
              <li
                className={`${
                  router.asPath.indexOf(playlist.id) > -1
                    ? 'text-green-500'
                    : ''
                } mb-2 hover:text-green-500 text-neutral-400`}
                key={playlist.id}
              >
                <Link href={`/playlist/${playlist.id}`}>{playlist.name}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <SearchResults />
    </aside>
  )
}
