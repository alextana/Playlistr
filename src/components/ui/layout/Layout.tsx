import React, { useEffect } from 'react'
import Header from './Header'
import RightSidebar from './RightSidebar'
import { useSession } from 'next-auth/react'
import LoginScreen from 'src/components/widgets/LoginScreen'
import MobileBar from './MobileBar'
import Footer from './Footer'
import LoadingScreen from 'src/components/widgets/LoadingScreen'

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
