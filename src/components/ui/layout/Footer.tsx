import Link from 'next/link'
import React from 'react'
import { useAtom } from 'jotai'
import { attributionAtom } from 'src/store/store'

export default function Footer() {
  const [attribution] = useAtom(attributionAtom)

  return (
    <div className='w-max mx-auto text-center'>
      playlistr for Spotify, built with the{' '}
      <Link passHref href='https://create.t3.gg/'>
        <a className='hover:text-green-500' rel='noreferrer' target='_blank'>
          T3 Stack
        </a>
      </Link>
      <h3
        className='text-sm mt-2'
        dangerouslySetInnerHTML={{ __html: attribution }}
      ></h3>
    </div>
  )
}
