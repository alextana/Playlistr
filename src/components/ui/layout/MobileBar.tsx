import React, { useState, useEffect } from 'react'
import { HiSearch, HiHome, HiPlusCircle } from 'react-icons/hi'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Portal } from 'react-portal'
import MobileSearch from './MobileSearch'
import { useAtom } from 'jotai'
import { searchAtom } from 'src/store/store'

export default function MobileBar() {
  const router = useRouter()
  const [search, setSearch] = useAtom(searchAtom)

  const [activePage, setActivePage] = useState<string>('')

  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false)
  function handleSearch() {
    setActivePage('search')
    setSearch(true)
    setMobileSearchOpen(true)
  }

  function handleCloseSearch() {
    setMobileSearchOpen(false)
    setSearch(false)
    setActivePage('')
  }

  useEffect(() => {
    if (mobileSearchOpen) {
      setActivePage('search')
      return
    }

    switch (router.pathname) {
      case '/':
        setActivePage('home')
        break
      case '/create-playlist':
        setActivePage('playlist')
        break
    }
  }, [router, activePage, mobileSearchOpen])

  return (
    <div className='fixed bottom-0 left-0 z-50 w-full'>
      <div className='entries bg-black/90 border-t border-gray-800 w-screen pt-4 pb-8 backdrop-blur-lg grid grid-cols-3 text-center'>
        <Link href='/'>
          <a
            role='link'
            className={`${
              activePage === 'home' ? 'text-green-500 pointer-events-none' : ''
            } h-full flex flex-wrap items-center ${activePage} hover:text-green-500 cursor-pointer justify-center w-full border-r border-white/30`}
          >
            <HiHome className='h-5 w-5 md:h-7 md:w-7' />
            <h2 className='text-xs w-full'>Home</h2>
          </a>
        </Link>
        <div
          onClick={handleSearch}
          className={`${
            activePage === 'search' ? 'text-green-500 pointer-events-none' : ''
          } h-full flex flex-wrap items-center hover:text-green-500 cursor-pointer justify-center w-full border-r border-white/30`}
        >
          <HiSearch className='h-5 w-5 md:h-7 md:w-7' />
          <h2 className='text-xs w-full'>Search</h2>
        </div>
        <Link href='/create-playlist'>
          <a
            className={`${
              activePage === 'playlist'
                ? 'text-green-500 pointer-events-none'
                : ''
            } h-full flex flex-wrap items-center hover:text-green-500 cursor-pointer justify-center w-full border-r border-white/30`}
          >
            <HiPlusCircle className='h-5 w-5 md:h-7 md:w-7' />
            <h2 className='text-xs w-full'>New Playlist</h2>
          </a>
        </Link>
      </div>
      <Portal>
        <MobileSearch
          open={mobileSearchOpen}
          handleCloseSearch={handleCloseSearch}
        />
      </Portal>
    </div>
  )
}
