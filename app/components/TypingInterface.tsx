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
  onScoreUpdate?: (
    score: number,
    grade: string,
    judgment: JudgmentStats
  ) => void;
  onGameComplete?: () => void;
}

interface JudgmentStats {
  criticalPerfect: number;
  perfect: number;
  great: number;
  good: number;
  miss: number;
}

interface CharacterState {
  char: string;
  romanji: string;
  status: "pending" | "correct" | "incorrect";
  typed: boolean;
}

const TypingInterface = ({
  lyrics,
  lyrics_romaji,
  currentTime,
  onScoreUpdate,
  onGameComplete,
}: TypingInterfaceProps) => {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [userInput, setUserInput] = useState("");
  const [japaneseText, setJapaneseText] = useState("");
  const [romanjiText, setRomanjiText] = useState("");
  const [romanjiStates, setRomanjiStates] = useState<
    ("pending" | "correct" | "incorrect")[]
  >([]);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [judgmentStats, setJudgmentStats] = useState<JudgmentStats>({
    criticalPerfect: 0,
    perfect: 0,
    great: 0,
    good: 0,
    miss: 0,
  });
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  const [totalCharsInGame, setTotalCharsInGame] = useState(0);
  const [currentLineCorrectChars, setCurrentLineCorrectChars] = useState(0);
  const [processedLines, setProcessedLines] = useState<Set<number>>(new Set());
  const hiddenInputRef = useRef<HTMLInputElement>(null);

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
      if (
        countdownValue !== countdown &&
        countdownValue >= 1 &&
        countdownValue <= 3
      ) {
        setCountdown(countdownValue);
      }
      return;
    }

    // Hide countdown and enable input when first lyric starts
    if (showCountdown && currentTime >= firstLyricTime) {
      setShowCountdown(false);
      setInputDisabled(false);
    }

    // Find current lyric and handle missed lyrics
    const currentLyric = lyrics.findIndex((lyric, index) => {
      const lyricTime = timeToSeconds(lyric.time);
      const nextLyricTime =
        index < lyrics.length - 1
          ? timeToSeconds(lyrics[index + 1].time)
          : Infinity;
      return currentTime >= lyricTime && currentTime < nextLyricTime;
    });

    // Check for missed/skipped lyrics
    for (let i = 0; i < lyrics.length; i++) {
      const lyricTime = timeToSeconds(lyrics[i].time);
      const nextLyricTime =
        i < lyrics.length - 1
          ? timeToSeconds(lyrics[i + 1].time)
          : lyricTime + 5;

      // If current time has passed this lyric's window and it wasn't processed
      if (
        currentTime > nextLyricTime &&
        !processedLines.has(i) &&
        i !== currentLyric
      ) {
        // Mark entire line as missed (count as 1 miss, not per character)
        const newStats = { ...judgmentStats };
        newStats.miss++;
        setJudgmentStats(newStats);
        setProcessedLines((prev) => new Set(prev).add(i));
      }
    }

    if (currentLyric !== -1 && currentLyric !== currentLyricIndex) {
      setCurrentLyricIndex(currentLyric);
      setUserInput("");
    }
  }, [
    currentTime,
    lyrics,
    currentLyricIndex,
    countdown,
    showCountdown,
    processedLines,
    judgmentStats,
  ]);

  // Focus hidden input and handle clicks
  useEffect(() => {
    const handleClick = () => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    };

    document.addEventListener("click", handleClick);

    // Auto focus when component mounts
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // Function to remove punctuation and convert to lowercase
  const cleanRomanjiText = (text: string): string => {
    return text
      .replace(/[.,!?;:"'()[\]{}\-—]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  };

  // Calculate grade based on achievement rate (maimai style)
  const calculateGrade = (achievementRate: number): string => {
    if (achievementRate >= 100.5) return "SSS+";
    if (achievementRate >= 100.0) return "SSS";
    if (achievementRate >= 99.5) return "SS+";
    if (achievementRate >= 99.0) return "SS";
    if (achievementRate >= 98.0) return "S+";
    if (achievementRate >= 97.0) return "S";
    if (achievementRate >= 94.0) return "AAA";
    if (achievementRate >= 90.0) return "AA";
    if (achievementRate >= 80.0) return "A";
    if (achievementRate >= 75.0) return "BBB";
    if (achievementRate >= 70.0) return "BB";
    if (achievementRate >= 60.0) return "B";
    if (achievementRate >= 50.0) return "C";
    return "D";
  };

  // Judge typing accuracy (maimai style)
  const judgeAccuracy = (
    correctChars: number,
    totalChars: number,
    mistakes: number
  ): string => {
    const accuracy = correctChars / totalChars;
    if (accuracy === 1 && mistakes === 0) return "criticalPerfect";
    if (accuracy >= 0.95) return "perfect";
    if (accuracy >= 0.85) return "great";
    if (accuracy >= 0.7) return "good";
    return "miss";
  };

  // Calculate total characters in the entire game (one-time calculation)
  useEffect(() => {
    if (lyrics_romaji.length > 0 && totalCharsInGame === 0) {
      const total = lyrics_romaji.reduce((sum, lyric) => {
        return sum + cleanRomanjiText(lyric.text).length;
      }, 0);
      setTotalCharsInGame(total);
    }
  }, [lyrics_romaji, totalCharsInGame]);

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
      setCurrentLineCorrectChars(0); // Reset current line progress
    }
  }, [currentLyricIndex, lyrics, lyrics_romaji]);

  // Handle typing input
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Don't allow input if disabled
      if (inputDisabled) {
        e.preventDefault();
        return;
      }

      // Don't allow input if current line has already been completed
      if (processedLines.has(currentLyricIndex)) {
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

      // Calculate correct chars for current line
      const correctChars = updatedStates.filter((s) => s === "correct").length;
      const totalChars = romanjiText.length;

      // Only update if current line correct chars increased (never decrease)
      if (correctChars > currentLineCorrectChars) {
        const increase = correctChars - currentLineCorrectChars;
        setTotalCorrectChars((prev) => prev + increase);
        setCurrentLineCorrectChars(correctChars);
      }

      // Calculate overall game progress percentage from the persistent total
      const gameProgressPercentage =
        totalCharsInGame > 0 ? (totalCorrectChars / totalCharsInGame) * 100 : 0;

      const grade = calculateGrade(gameProgressPercentage);

      setScore(gameProgressPercentage);
      onScoreUpdate?.(gameProgressPercentage, grade, judgmentStats);

      // Auto advance to next lyric if completed correctly
      if (correctChars === totalChars && totalChars > 0) {
        // Judge this line based on overall accuracy
        const mistakes = updatedStates.filter((s) => s === "incorrect").length;
        const accuracy = correctChars / totalChars;

        let judgment = "";
        if (accuracy === 1 && mistakes === 0) {
          judgment = "criticalPerfect";
        } else if (accuracy >= 0.95) {
          judgment = "perfect";
        } else if (accuracy >= 0.85) {
          judgment = "great";
        } else if (accuracy >= 0.7) {
          judgment = "good";
        } else {
          judgment = "miss";
        }

        // Update judgment stats (count this line as 1 judgment)
        const newStats = { ...judgmentStats };
        newStats[judgment as keyof JudgmentStats]++;
        setJudgmentStats(newStats);

        // Mark this line as processed
        setProcessedLines((prev) => new Set(prev).add(currentLyricIndex));

        setTimeout(() => {
          if (currentLyricIndex < lyrics.length - 1) {
            setCurrentLyricIndex((prev) => prev + 1);
            setUserInput("");
          } else {
            // Game completed - all lyrics finished
            onGameComplete?.();
          }
        }, 500);
      }
    },
    [
      romanjiStates,
      romanjiText,
      currentLyricIndex,
      lyrics.length,
      onScoreUpdate,
      inputDisabled,
      judgmentStats,
      totalCorrectChars,
      totalCharsInGame,
      currentLineCorrectChars,
      processedLines,
      lyrics_romaji,
      onGameComplete,
    ]
  );

  // Show countdown with upcoming lyrics if active
  if (showCountdown) {
    const upcomingJapanese = lyrics[0]?.text || "";
    const upcomingRomanji = lyrics_romaji[0]?.text || "";
    const cleanedUpcomingRomanji = cleanRomanjiText(upcomingRomanji);

    return (
      <div className="fixed inset-0 flex items-center justify-center">
        {/* Invisible tap area for iOS focus */}
        <div 
          className="absolute inset-0 pointer-events-auto cursor-pointer"
          onClick={() => {
            if (hiddenInputRef.current) {
              hiddenInputRef.current.focus();
            }
          }}
          style={{ backgroundColor: 'transparent' }}
        />
        
        <div className="text-center max-w-4xl mx-auto px-8 pointer-events-none">
          {/* Show upcoming lyrics */}
          <div className="text-4xl mb-6 font-bold leading-relaxed text-gray-500 drop-shadow-2xl">
            <span style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
              {upcomingJapanese}
            </span>
          </div>

          <div className="text-2xl mb-8 text-center font-mono leading-relaxed text-gray-500 flex flex-col justify-center items-center gap-2">
            <span style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
              {cleanedUpcomingRomanji}
            </span>
          </div>

          {/* Countdown dots */}
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
                  boxShadow:
                    countdown >= dotNumber
                      ? "0 0 20px rgba(255,255,255,0.5)"
                      : "none",
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Hidden input field for capturing keystrokes - always enabled */}
        <input
          ref={hiddenInputRef}
          type="text"
          value=""
          onChange={() => {}} // Ignore input during countdown
          className="absolute -left-96 opacity-0 pointer-events-auto"
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          style={{ position: "fixed", left: "-9999px" }}
        />
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
          {romanjiText.split("").map((char, index) => {
            // If current line is completed, show all characters as white
            const isLineCompleted = processedLines.has(currentLyricIndex);

            return (
              <span
                key={index}
                className={`${
                  isLineCompleted || romanjiStates[index] === "correct"
                    ? "text-white"
                    : romanjiStates[index] === "incorrect"
                    ? "text-red-400"
                    : "text-gray-400"
                } transition-colors duration-200`}
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                {char}
              </span>
            );
          })}
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
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        style={{ position: "fixed", left: "-9999px" }}
      />
    </div>
  );
};

export default TypingInterface;
