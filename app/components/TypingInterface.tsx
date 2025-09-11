"use client";
import { useState, useEffect, useCallback, useRef } from "react";

interface LyricLine {
  time: string;
  text: string;
}

interface TypingInterfaceProps {
  lyrics: LyricLine[];
  lyrics_romaji: LyricLine[];
  currentTime: number;
  onScoreUpdate?: (score: number) => void;
}

interface CharacterState {
  char: string;
  romanji: string;
  status: "pending" | "correct" | "incorrect";
  typed: boolean;
}

const TypingInterface = ({ lyrics, lyrics_romaji, currentTime, onScoreUpdate }: TypingInterfaceProps) => {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [userInput, setUserInput] = useState("");
  const [japaneseText, setJapaneseText] = useState("");
  const [romanjiText, setRomanjiText] = useState("");
  const [romanjiStates, setRomanjiStates] = useState<("pending" | "correct" | "incorrect")[]>([]);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Convert time string (00:14.14) to seconds
  const timeToSeconds = (timeStr: string): number => {
    const [minutes, seconds] = timeStr.split(":");
    return parseInt(minutes) * 60 + parseFloat(seconds);
  };

  // Find current lyric based on video time and handle countdown
  useEffect(() => {
    if (lyrics.length === 0) return;

    const firstLyricTime = timeToSeconds(lyrics[0].time);
    const countdownStartTime = firstLyricTime - 3; // 3 seconds before first lyric

    // Handle countdown before first lyric
    if (currentTime >= countdownStartTime && currentTime < firstLyricTime) {
      const timeUntilFirstLyric = firstLyricTime - currentTime;
      const countdownValue = Math.ceil(timeUntilFirstLyric);
      
      if (!showCountdown) setShowCountdown(true);
      if (countdownValue !== countdown && countdownValue >= 1 && countdownValue <= 3) {
        setCountdown(countdownValue);
      }
      setInputDisabled(true);
      return;
    }

    // Hide countdown and enable input when first lyric starts
    if (showCountdown && currentTime >= firstLyricTime) {
      setShowCountdown(false);
      setInputDisabled(false);
    }

    // Find current lyric
    const currentLyric = lyrics.findIndex((lyric, index) => {
      const lyricTime = timeToSeconds(lyric.time);
      const nextLyricTime = index < lyrics.length - 1 ? timeToSeconds(lyrics[index + 1].time) : Infinity;
      return currentTime >= lyricTime && currentTime < nextLyricTime;
    });

    if (currentLyric !== -1 && currentLyric !== currentLyricIndex) {
      setCurrentLyricIndex(currentLyric);
      setUserInput("");
    }
  }, [currentTime, lyrics, currentLyricIndex, countdown, showCountdown]);

  // Focus hidden input and handle clicks
  useEffect(() => {
    const handleClick = () => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    };

    document.addEventListener('click', handleClick);
    
    // Auto focus when component mounts
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Function to remove punctuation and convert to lowercase
  const cleanRomanjiText = (text: string): string => {
    return text.replace(/[.,!?;:"'()[\]{}\-—]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  };

  // Initialize texts when lyric changes
  useEffect(() => {
    if (lyrics[currentLyricIndex] && lyrics_romaji[currentLyricIndex]) {
      const currentText = lyrics[currentLyricIndex].text;
      const currentRomanji = lyrics_romaji[currentLyricIndex].text;
      const cleanedRomanji = cleanRomanjiText(currentRomanji);
      
      setJapaneseText(currentText);
      setRomanjiText(cleanedRomanji);
      setRomanjiStates(new Array(cleanedRomanji.length).fill("pending"));
      setUserInput("");
    }
  }, [currentLyricIndex, lyrics, lyrics_romaji]);

  // Handle typing input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Don't allow input if disabled
    if (inputDisabled) {
      e.preventDefault();
      return;
    }

    const newInput = e.target.value;
    setUserInput(newInput);

    // Update romanji character states based on input
    const updatedStates = [...romanjiStates];
    
    for (let i = 0; i < romanjiText.length; i++) {
      if (i < newInput.length) {
        if (newInput[i].toLowerCase() === romanjiText[i].toLowerCase()) {
          updatedStates[i] = "correct";
        } else {
          updatedStates[i] = "incorrect";
        }
      } else {
        updatedStates[i] = "pending";
      }
    }

    setRomanjiStates(updatedStates);

    // Update score
    const correctChars = updatedStates.filter(s => s === "correct").length;
    const totalChars = romanjiText.length;
    const newScore = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    setScore(newScore);
    onScoreUpdate?.(newScore);

    // Auto advance to next lyric if completed correctly
    if (correctChars === totalChars && totalChars > 0) {
      setTimeout(() => {
        if (currentLyricIndex < lyrics.length - 1) {
          setCurrentLyricIndex(prev => prev + 1);
          setUserInput("");
        }
      }, 500);
    }
  }, [romanjiStates, romanjiText, currentLyricIndex, lyrics.length, onScoreUpdate, inputDisabled]);

  // Show countdown if active
  if (showCountdown) {
    return (
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((dotNumber) => (
              <div
                key={dotNumber}
                className={`w-6 h-6 rounded-full transition-all duration-500 ${
                  countdown >= dotNumber 
                    ? "bg-white opacity-100 scale-100" 
                    : "bg-gray-600 opacity-30 scale-75"
                }`}
                style={{
                  boxShadow: countdown >= dotNumber ? "0 0 20px rgba(255,255,255,0.5)" : "none"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentLyricIndex === -1 || !lyrics[currentLyricIndex]) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center max-w-4xl mx-auto px-8">
        {/* Japanese text display (static) */}
        <div className="text-4xl mb-6 font-bold leading-relaxed text-gray-400 drop-shadow-2xl">
          <span style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
            {japaneseText}
          </span>
        </div>

        {/* Romanji display with character-by-character highlighting */}
        <div className="text-2xl text-center font-mono leading-relaxed">
          {romanjiText.split('').map((char, index) => (
            <span
              key={index}
              className={`${
                romanjiStates[index] === "correct"
                  ? "text-white"
                  : romanjiStates[index] === "incorrect"
                  ? "text-red-400"
                  : "text-gray-400"
              } transition-colors duration-200`}
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Hidden input field for capturing keystrokes */}
      <input
        ref={hiddenInputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={inputDisabled}
        className="absolute -left-96 opacity-0 pointer-events-auto"
        autoFocus
        style={{ position: 'fixed', left: '-9999px' }}
      />
    </div>
  );
};

export default TypingInterface;