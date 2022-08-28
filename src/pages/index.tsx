import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Playlists from 'src/components/widgets/Playlists'

export default function Home() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <Head>
          <title>Playlistr | Welcome</title>
        </Head>
        <Playlists />
      </>
    )
  }
}
