import React from 'react'
import PlaylistWizard from 'src/components/widgets/playlist-wizard/PlaylistWizard'

export default function CreatePlaylist() {
  return (
    <div>
      <div className='title'>
        <h1 className='font-extrabold tracking-tighter text-4xl mb-4'>
          Create new playlist
        </h1>
        <PlaylistWizard />
      </div>
    </div>
  )
}
