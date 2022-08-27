import React from 'react'
import Header from './Header'
import RightSidebar from './RightSidebar'
import { useSession } from 'next-auth/react'
import LoginScreen from 'src/components/widgets/LoginScreen'
import MobileBar from './MobileBar'
import Footer from './Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  if (!session) {
    return (
      <>
        <Header />
        <main className='flex container mx-auto gap-3'>
          <LoginScreen />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className='flex container mx-auto gap-3 pb-32 xl:pb-0'>
        <div className='flex-grow'>{children}</div>
        <div className='hidden lg:block'>
          <RightSidebar />
        </div>
        <div className='block lg:hidden'>
          <MobileBar />
        </div>
      </main>
    </>
  )
}
