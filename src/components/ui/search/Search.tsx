import React, { useEffect, useRef } from 'react'
import { searchAtom, searchTermsAtom } from 'src/store/store'
import { useAtom } from 'jotai'
export default function Search() {
  const [, setSearch] = useAtom(searchAtom)
  const [, setSearchTerms] = useAtom(searchTermsAtom)

  const inputEl = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!inputEl.current) return

    inputEl.current.focus()
  }, [inputEl])

  return (
    <div className='relative w-full'>
      <input
        ref={inputEl}
        className='w-full py-2 pl-4 pr-8 text-neutral-600 bg-white rounded-full'
        type='text'
        onChange={(e) => setSearchTerms(e.target.value)}
      ></input>
      <div
        onClick={() => setSearch(false)}
        className='close-icon absolute cursor-pointer text-gray-500 hover:text-gray-900 right-2 top-1/2 transform -translate-y-1/2'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </div>
    </div>
  )
}
