"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Judge, Song } from "@/app/types";
import TypingInterface from "@/app/components/TypingInterface";
import ResultScreen from "@/app/components/ResultScreen";

const Player = ({ song }: { song: Song }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const level = searchParams.get("level") || "normal";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [grade, setGrade] = useState("D");
  const [judgmentStats, setJudgmentStats] = useState({
    criticalPerfect: 0,
    perfect: 0,
    great: 0,
    good: 0,
    miss: 0
  });
  const [showResults, setShowResults] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Get playback speed based on level
  const getPlaybackSpeed = (level: string): number => {
    switch (level) {
      case "0.5": return 0.5;
      case "0.75": return 0.75;
      case "1.0": return 1.0;
      case "1.25": return 1.25;
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

    const handleVideoEnd = () => {
      // Video finished - trigger results screen
      handleGameComplete();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleVideoEnd);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleVideoEnd);
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

  const handleScoreUpdate = (newScore: number, newGrade: string, newJudgmentStats: Judge) => {
    setScore(newScore);
    setGrade(newGrade);
    setJudgmentStats(newJudgmentStats);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    setTimeout(() => {
      setShowResults(true);
    }, 1000); // Delay to show final score briefly
  };

  const handlePlayAgain = () => {
    window.location.reload(); // Simple way to restart the game
  };

  const handleBackToMenu = () => {
    router.push('/'); // Navigate back to home
  };

  // Show results screen if game completed
  if (showResults) {
    return (
      <ResultScreen
        song={song}
        score={score}
        grade={grade}
        judgmentStats={judgmentStats}
        level={level}
        onPlayAgain={handlePlayAgain}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

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
        <source src={`https://object.xyspg.moe/vocaloid/videos/${song.video}`} type="video/mp4" />
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

        {/* Score and Grade display */}
        {!isMuted && !gameCompleted && (
          <div className="absolute top-6 right-6 space-y-2">
            <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg">
              <div className="text-2xl font-bold text-center">{grade}</div>
              <div className="text-sm text-center">{score.toFixed(4)}%</div>
            </div>
        
          </div>
        )}
      </div>

      {/* Typing Interface */}
      {!isMuted && !gameCompleted && (
        <TypingInterface
          lyrics={song.lyrics}
          lyrics_romaji={song.lyrics_romaji}
          currentTime={currentTime}
          onScoreUpdate={handleScoreUpdate}
          onGameComplete={handleGameComplete}
        />
      )}
    </div>
  );
};

export default Player;
