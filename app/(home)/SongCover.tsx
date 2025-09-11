import React from "react";
import Image from "next/image";
import { Song } from "@/app/types";
import Link from "next/link";

const SongCover = ({ song }: { song: Song }) => {
  return (
    <div>
      <div className="relative w-full aspect-square shadow-2xl rounded-lg hover:scale-102 transition-all duration-200 hover:shadow-4xl cursor-pointer">
        <Link href={`/play/${song.slug}`}>
        <Image
          src={song.cover}
          alt={song.title}
          fill
          className="object-cover"
        />
        </Link>
      </div>
      <div className="text-center mt-2">
        <h2 className="text-lg font-bold">{song.title}</h2>
        <p className="text-sm">{song.artist}</p>
      </div>
    </div>
  );
};

export default SongCover;
