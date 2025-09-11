"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Song } from "@/app/types";
import TypingInterface from "@/app/components/TypingInterface";

const Player = ({ song }: { song: Song }) => {
  const searchParams = useSearchParams();
  const level = searchParams.get("level") || "normal";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  // Get playback speed based on level
  const getPlaybackSpeed = (level: string): number => {
    switch (level) {
      case "BASIC": return 0.5;
      case "ADVANCED": return 0.75;
      case "EXPERT": return 1.0;
      case "MASTER": return 1.25;
      default: return 1.0;
    }
  };

  // Set playback speed when level changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = getPlaybackSpeed(level);
    }
  }, [level]);

  // Track video time and playing state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleLoadedMetadata = () => {
      const targetSpeed = getPlaybackSpeed(level);
      video.playbackRate = targetSpeed;
      console.log(`Set playback rate to ${targetSpeed} for level ${level}`);
    };

    const handleCanPlay = () => {
      const targetSpeed = getPlaybackSpeed(level);
      video.playbackRate = targetSpeed;
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [level]);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    setIsMuted(false);
    
    // Set playback rate and play with error handling
    const targetSpeed = getPlaybackSpeed(level);
    video.playbackRate = targetSpeed;
    
    video.play().then(() => {
      // Double-check playback rate after play starts
      if (video.playbackRate !== targetSpeed) {
        video.playbackRate = targetSpeed;
      }
    }).catch((error) => {
      console.error('Play failed:', error);
      // Try playing again after a short delay
      setTimeout(() => {
        video.play().catch(() => {});
      }, 100);
    });
  };

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Full-screen video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted={isMuted}
        playsInline
        controls={false}
      >
        <source src={song.video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        {isMuted && (
          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" onClick={handleUnmute}>
            <svg
              height="200px"
              width="200px"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              enableBackground="new 0 0 512 512"
              fill="white"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <g fill="white">
                    <path d="m354.2,247.4l-135.1-92.4c-4.2-3.1-15.4-3.1-16.3,8.6v184.8c1,11.7 12.4,11.9 16.3,8.6l135.1-92.4c3.5-2.1 8.3-10.7 0-17.2zm-130.5,81.3v-145.4l106.1,72.7-106.1,72.7z"></path>{" "}
                    <path d="M256,11C120.9,11,11,120.9,11,256s109.9,245,245,245s245-109.9,245-245S391.1,11,256,11z M256,480.1 C132.4,480.1,31.9,379.6,31.9,256S132.4,31.9,256,31.9S480.1,132.4,480.1,256S379.6,480.1,256,480.1z"></path>{" "}
                    </g>
                </g>
              </g>
            </svg>
          </button>
        )}

        {/* Score and Level display */}
        {!isMuted && (
          <div className="absolute top-6 right-6 space-y-2">
            <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg">
              <div className="text-lg font-bold">{score}%</div>
            </div>
            <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg">
              <div className="text-sm capitalize">{level} ({getPlaybackSpeed(level)}x)</div>
            </div>
          </div>
        )}
      </div>

      {/* Typing Interface */}
      {!isMuted && (
        <TypingInterface
          lyrics={song.lyrics}
          lyrics_romaji={song.lyrics_romaji}
          currentTime={currentTime}
          onScoreUpdate={handleScoreUpdate}
        />
      )}
    </div>
  );
};

export default Player;
