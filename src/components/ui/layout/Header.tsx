import { useSession, signOut } from 'next-auth/react'
import React from 'react'
import { HiLogout } from 'react-icons/hi'
import Link from 'next/link'
import Image from 'next/future/image'
import Logo from '../logo/Logo'
export default function Header({ isFixed }: { isFixed?: boolean }) {
  const { data: session } = useSession()

  return (
    <header
      className={`${isFixed ? 'fixed top-0 left-0 w-full' : ''}`}
      style={{ zIndex: 3 }}
    >
      <div className='header-container mx-auto py-4 z-50 container flex justify-between items-center'>
        <Link href='/' className='logo text-3xl tracking-tight font-extrabold'>
          <a>
            <Logo />
          </a>
        </Link>

        {session && (
          <div className='header-user-info flex gap-3 items-center'>
            <figure className='w-8 h-8 relative shadow-sm rounded-full overflow-hidden'>
              <Image
                width={30}
                className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
                priority={true}
                src={session.user?.image || ''}
                alt={session.user?.name || ''}
                sizes='(min-width: 1px) 20px'
                style={{ height: 'auto' }}
              />
            </figure>
            <span className='hidden lg:block'>
              Hello, {session?.user?.name}
            </span>
            <HiLogout
              className='w-5 h-5 hover:text-green-500 cursor-pointer'
              role='link'
              onClick={() =>
                signOut({
                  callbackUrl: '/',
                })
              }
            />
          </div>
        )}
      </div>
    </header>
  )
}
