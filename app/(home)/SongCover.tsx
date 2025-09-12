import React from "react";
import Image from "next/image";
import { Song } from "@/app/types";
import { motion } from "motion/react";

const SongCover = ({
  song,
  onClick,
}: {
  song: Song;
  onClick?: (s: Song) => void;
}) => {
  return (
      <motion.div
        layoutId={`album-${song.slug}`}
        onClick={() => onClick?.(song)}
        className="relative w-full aspect-square shadow-2xl rounded-lg overflow-hidden"
        whileHover={ onClick ? { y: -4, scale: 1.02 } : undefined }
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        <Image
          src={`https://object.xyspg.moe/vocaloid/images/${song.cover}`}
                    alt={song.title}
          fill
          className="object-cover"
        />
      </motion.div>
  );
};

export default SongCover;
