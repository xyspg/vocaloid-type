"use client";
import { Song } from "@/app/types";
import Image from "next/image";

interface JudgmentStats {
  criticalPerfect: number;
  perfect: number;
  great: number;
  good: number;
  miss: number;
}

interface ResultScreenProps {
  song: Song;
  score: number;
  grade: string;
  judgmentStats: JudgmentStats;
  level: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

const ResultScreen = ({ 
  song, 
  score, 
  grade, 
  judgmentStats, 
  level,
  onPlayAgain, 
  onBackToMenu 
}: ResultScreenProps) => {
  const totalNotes = judgmentStats.criticalPerfect + judgmentStats.perfect + 
                    judgmentStats.great + judgmentStats.good + judgmentStats.miss;
                    
  // Calculate total possible characters in the game
  const totalPossibleChars = song.lyrics_romaji.reduce((sum, lyric) => {
    const cleanText = lyric.text.replace(/[.,!?;:"'()[\]{}\-—]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    return sum + cleanText.length;
  }, 0);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      {/* Main Result Circle */}
      <audio src='/result.mp3' autoPlay loop />
      <div className="relative w-[800px] h-[800px] bg-gradient-to-br from-yellow-300 via-orange-300 to-yellow-400 rounded-full flex items-center justify-center shadow-2xl">
        
        {/* Inner Content Area */}
        <div className="w-[750px] h-[750px] bg-gradient-to-br from-yellow-200 via-orange-200 to-yellow-300 rounded-full flex flex-col items-center justify-center relative overflow-hidden">
          
          {score > 80 && (
            <div className="absolute top-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-2 rounded-full text-2xl font-bold tracking-wider">
              TRACK CLEAR!
            </div>
          </div>
          )}
          

          {/* Song Info */}
          <div className="absolute top-20 flex items-center gap-4">
            <Image
              src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/vocaloid/images/${song.cover}`} 
              alt={song.title}
              className="w-24 h-24 rounded-lg shadow-lg"
              width={96}
              height={96}
            />
            <div className="text-center">
              <div className="text-white bg-purple-600 px-4 py-1 rounded-full text-sm font-bold">
                {level.toUpperCase()}x
              </div>
              <div className="text-black text-lg font-bold mt-1 max-w-48 truncate">
                {song.title}
              </div>
            </div>
          </div>

          {/* Achievement Percentage */}
          <div className="text-center mb-8">
            <div className="text-8xl font-bold text-orange-600 drop-shadow-lg">
              {score.toFixed(4)}%
            </div>
          </div>

          {/* Grade */}
          <div className="mb-48">
            <div className="text-6xl font-bold text-yellow-600 drop-shadow-lg tracking-wider">
              {grade}
            </div>
          </div>

          {/* Character Image */}
          <div className="absolute right-8 bottom-8">
            <Image 
              src="/bear.png" 
              alt="Character"
              width={384}
              height={384}
              className="w-96 h-96 object-contain"
            />
          </div>

          {/* Judgment Stats */}
          {/* <div className="absolute left-32 bottom-24 space-y-2">
            <div className="bg-yellow-400  text-black px-4 py-2 rounded-lg text-sm font-bold flex justify-between items-center min-w-[200px]">
              <span>CRITICAL PERFECT</span>
              <span className="text-2xl">{judgmentStats.criticalPerfect}</span>
            </div>
            <div className="bg-pink-400 text-black px-4 py-2 rounded-lg text-lg font-bold flex justify-between items-center min-w-[200px]">
              <span>PERFECT</span>
              <span className="text-2xl">{judgmentStats.perfect}</span>
            </div>
            <div className="bg-green-400 text-black px-4 py-2 rounded-lg text-lg font-bold flex justify-between items-center min-w-[200px]">
              <span>GREAT</span>
              <span className="text-2xl">{judgmentStats.great}</span>
            </div>
            <div className="bg-blue-400 text-black px-4 py-2 rounded-lg text-lg font-bold flex justify-between items-center min-w-[200px]">
              <span>GOOD</span>
              <span className="text-2xl">{judgmentStats.good}</span>
            </div>
            <div className="bg-red-400 text-white px-4 py-2 rounded-lg text-lg font-bold flex justify-between items-center min-w-[200px]">
              <span>MISS</span>
              <span className="text-2xl">{judgmentStats.miss}</span>
            </div>
          </div> */}

        

          {/* Total Notes */}
          {/* <div className="absolute bottom-8 text-center">
            <div className="text-black text-lg">
              <span className="font-bold">{totalNotes}</span> / <span className="font-bold">{song.lyrics.length}</span>
            </div>
          </div> */}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-[-60px] flex gap-6">
          <button 
            onClick={onPlayAgain}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-xl font-bold transition-colors"
          >
            PLAY AGAIN
          </button>
          <button 
            onClick={onBackToMenu}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-xl font-bold transition-colors"
          >
            BACK TO MENU
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-8 h-8 bg-white rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-6 h-6 bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-10 h-10 bg-pink-300 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-12 h-12 bg-blue-300 rounded-full opacity-40 animate-pulse"></div>
    </div>
  );
};

export default ResultScreen;