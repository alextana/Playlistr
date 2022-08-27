import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import LoadingPlaylist from 'src/components/ui/playlists/LoadingPlaylist'
import PlaylistElement from 'src/components/ui/playlists/PlaylistElement'
import RecommendedTracks from 'src/components/ui/playlists/RecommendedTracks'

const Playlist = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { id } = router.query

  const { isLoading: playlistLoading, data: playlistData } = useQuery(
    ['getPlaylist', id],
    async () => {
      const res = await fetch(`/api/playlist/?id=${id}`)

      return res.json()
    }
  )

  const handleReshuffle = () => {
    queryClient.invalidateQueries(['getRecommended'])
  }

  const {
    isLoading: recommendedLoading,
    isFetching: recommendedFetching,
    error: recommendedError,
    data: recommendedData,
  } = useQuery(
    ['getRecommended'],
    async () => {
      // get five random tracks from the data and send it to the api for seed
      let tracksToSend = []

      for (let x = 1; x <= 5; x++) {
        const randomIndex = Math.ceil(Math.random() * 5)

        if (!playlistData.tracks.items[randomIndex]) {
          continue
        }

        tracksToSend.push(playlistData.tracks.items[randomIndex].track.id)
      }

      if (!tracksToSend.length) {
        return
      }

      const res = await fetch(
        `/api/recommendations?tracks=${tracksToSend?.join(',')}`
      )

      return res.json()
    },
    {
      enabled: !!playlistData,
    }
  )

  return (
    <div className='playlist-container'>
      <>
        {playlistLoading ? (
          <div
            className='skeleton mb-4'
            style={{ height: '68px', width: '40%' }}
          ></div>
        ) : (
          <div className='mb-4 flex justify-between items-center'>
            <div className='playlist-info'>
              <h3 className='playlist-title text-4xl font-extrabold tracking-tighter'>
                {playlistData?.name}
              </h3>
              <h4 className='text-xl text-neutral-300'>
                {playlistData?.tracks?.total} tracks
              </h4>
            </div>
            <div
              onClick={handleReshuffle}
              className='reshuffle hidden lg:block px-4 py-1 rounded-full bg-neutral-900/50 mt-auto border border-white cursor-pointer hover:bg-green-900'
            >
              Reshuffle
            </div>
          </div>
        )}

        <div className='playlists-container grid grid-cols-1 lg:grid-cols-2 gap-3'>
          {playlistLoading && <LoadingPlaylist />}
          {playlistData && (
            <div>
              <h4 className='text-xl text-gray-400 font-extralight mb-2'>
                Current tracks
              </h4>
              <PlaylistElement playlist={playlistData} />
            </div>
          )}

          {(recommendedLoading || recommendedFetching) && <LoadingPlaylist />}

          {recommendedData && (
            <div>
              <div className='title flex gap-3 justify-between'>
                <h4 className='text-xl text-gray-400 font-extralight mb-2'>
                  Recommended tracks
                </h4>
                {/*
                  button for mobile
                */}
                <div
                  onClick={handleReshuffle}
                  className='reshuffle w-max mb-2 block lg:hidden px-4 py-1 rounded-full bg-neutral-900/50 mt-auto border border-white cursor-pointer hover:bg-green-900'
                >
                  Reshuffle
                </div>
              </div>
              <RecommendedTracks
                playlist={id}
                recommendations={recommendedData}
              />
            </div>
          )}
        </div>
      </>
    </div>
  )
}

export default Playlist
