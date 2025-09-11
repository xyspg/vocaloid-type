import React from "react";
import songs from "@/app/data/songs.json";
import Player from "./Player";

const Play = ({ params }: { params: { slug: string } }) => {
  // Find the song by slug
  const song = songs.find((s) => s.slug === params.slug);

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-2xl">Song not found</h1>
      </div>
    );
  }

  return (
    <>
      <Player song={song} />
    </>
  );
};

export default Play;
