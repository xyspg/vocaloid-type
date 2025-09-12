"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import SongCover from "./SongCover";
import LevelSelect from "./LevelSelect";
import songs from "@/app/data/songs.json";
import type { Song } from "@/app/types";

export default function SongSelect() {
  const [selected, setSelected] = useState<Song | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="mx-4 mt-8 md:mx-10 md:my-8 relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {(songs).map((song) => (
          <div key={song.slug} className="space-y-2 cursor-pointer">
            <SongCover
              song={song}
              onClick={setSelected}
            />
            <div className="text-center">
              <h2 className="text-base font-bold">{song.title}</h2>
              <p className="text-sm opacity-70">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 bg-white z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />

            <motion.div
              key="level-select"
              className="fixed z-20 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            >
              <LevelSelect song={selected} onClose={() => setSelected(null)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}