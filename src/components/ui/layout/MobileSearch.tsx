import React from 'react'
import { HiChevronLeft } from 'react-icons/hi'
import Search from '../search/Search'
import SearchResults from '../search/SearchResults'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export default function MobileSearch({
  open,
  handleCloseSearch,
}: {
  open: boolean
  handleCloseSearch: React.MouseEventHandler
}) {
  const [mobileBar] = useAutoAnimate<any>()

  return (
    <div ref={mobileBar}>
      {open && (
        <div className='fixed top-0 left-0 backdrop-blur-md z-10 w-full h-full bg-black/90 p-6'>
          <div className='flex gap-3 items-center'>
            <HiChevronLeft
              className='h-12 w-12 cursor-pointer'
              role='button'
              onClick={handleCloseSearch}
            />
            <Search />
          </div>
          <div className='results h-5/6 w-full'>
            <SearchResults />
          </div>
        </div>
      )}
    </div>
  )
}
