import React from 'react'
import SongCover from './SongCover'
import songs from '@/app/data/songs.json'

const SongSelect = () => {
  return (
    <>
   <div className="mt-8 md:mx-10 md:my-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 md:space-8">
        {songs.map((song) => (
          <SongCover key={song.slug} song={song} />
        ))}
      </div>
    </div>
    </>
  )
}

export default SongSelect