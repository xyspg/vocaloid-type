import React from "react";
import SongCover from "./SongCover";
import { Song } from "../types";
import Link from "next/link";
import clsx from "clsx";

const LevelSelect = ({ song }: { song: Song }) => {
  const levels = [
    {
      name: "BASIC",
      color: "bg-green-500",
    },
    {
      name: "ADVANCED",
      color: "bg-amber-500",
    },
    {
      name: "EXPERT",
      color: "bg-red-500",
    },
    {
      name: "MASTER",
      color: "bg-purple-500",
    },
  ];
  return (
    <div className="p-4 md:w-screen flex flex-col gap-16 md:gap-0 justify-around items-center md:flex-row ">
      <div className="w-5/6 md:w-1/3">
        <SongCover key={song.slug} song={song} />
      </div>
      <div className="flex flex-col gap-6 md:gap-8">
        {levels.map((level) => (
          <Link
            key={level.name}
            href={`/play/${song.slug}?level=${level.name}`}
          >
            <div
              className={clsx(
                "w-[20rem] h-16 text-2xl font-[family-name:var(--font-geist-sans)] text-white text-center rounded-lg shadow-2xl font-medium flex items-center justify-start pl-4",
                level.color
              )}
            >
              {level.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LevelSelect;
