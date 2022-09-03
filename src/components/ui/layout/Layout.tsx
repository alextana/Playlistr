import React, { useEffect } from 'react'
import Header from './Header'
import RightSidebar from './RightSidebar'
import { useSession } from 'next-auth/react'
import LoginScreen from 'src/components/widgets/LoginScreen'
import MobileBar from './MobileBar'
import Footer from './Footer'
import LoadingScreen from 'src/components/widgets/LoadingScreen'
import Head from 'next/head'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <>
        <LoadingScreen />
      </>
    )
  }

  if (!session) {
    return (
      <>
        <LoginScreen />
      </>
    )
  }

  return (
    <>
      <Head>
        <meta property='og:image' content='/images/og.png' />

        <meta
          property='og:title'
          content='Playlistr - Create and manage playlists'
        />

        <meta
          property='og:description'
          content='Playlistr is a tool to create and manage your Spotify playlists easily.'
        />
        <meta
          name='description'
          content='Playlistr is a tool to create and manage your Spotify playlists easily.'
        />
        <meta
          name='keywords'
          content='Spotify, Playlist, Manager, T3 Stack, React, Next'
        />
        <meta name='author' content='Alex Tana' />
      </Head>
      <Header />
      <main className='flex container mx-auto gap-6 pb-32 xl:pb-0'>
        <div className='flex-grow'>{children}</div>
        <div className='hidden lg:block'>
          <RightSidebar />
        </div>
        <div className='block lg:hidden'>
          <MobileBar />
        </div>
      </main>
      <Footer />
    </>
  )
}
