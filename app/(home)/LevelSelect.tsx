import React from "react";
import SongCover from "./SongCover";
import { Song } from "../types";
import Link from "next/link";
import clsx from "clsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LevelSelect = ({ song, onClose }: { song: Song, onClose: () => void }) => {
  const levels = [
    {
      name: "0.5",
      color: "text-green-500",
    },
    {
      name: "0.75",
      color: "text-amber-500",
    },
    {
      name: "1.0",
      color: "text-red-500",
    },
    {
      name: "1.25",
      color: "text-purple-500",
    },
  ];
  return (
    <div className="p-4 md:w-screen flex flex-col gap-16 justify-center items-center "
    onClick={(e) => {
        if (e.target === e.currentTarget) {
          console.log("Clicked empty area!");
          onClose();
        }
      }}
    >
      <div className="w-5/6 md:w-1/3">
        <SongCover key={song.slug} song={song} />
      </div>
      <Tabs defaultValue="account" className="w-[400px] flex items-center">
        <p className="text-lg font-bold">Speed</p>
        <TabsList>
          {levels.map((level) => (
            <TabsTrigger
              key={level.name}
              value={level.name}
              className={clsx("cursor-pointer w-16")}
            >
              <Link
                key={level.name}
                href={`/play/${song.slug}?level=${level.name}`}
              >
                {level.name}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default LevelSelect;
