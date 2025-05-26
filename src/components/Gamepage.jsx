import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import chess from "../assets/images/chess.jpeg";
import queen from "../assets/images/LightQueen.webp";
import AudioPlayer from "./AudioPlayer";

const GamePage = () => {
  // Game state initialization
  const [time, setTime] = useState(() => {
    return parseInt(localStorage.getItem("escapeRoomTime")) || 0;
  });

  const [keyboard, setKeyboard] = useState(() => {
    const saved = localStorage.getItem("escapeRoomKeyboard");
    return saved
      ? JSON.parse(saved)
      : [
          ["", "", ""],
          ["", "", "", ""],
          ["", "", "", ""],
        ];
  });

  const [level, setLevel] = useState(() => {
    return parseInt(localStorage.getItem("escapeRoomLevel")) || 1;
  });

  // New states for video and timer control
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  // Level 1 state
  const [selectedColors, setSelectedColors] = useState([null, null, null, null]);
  const [currentPosition, setCurrentPosition] = useState(3);

  // Level 2 state
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswer2, setUserAnswer2] = useState("");
  const [showFeedback, setShowFeedback] = useState(null);

  const colorOptions = [
    "black",
    "green",
    "yellow",
    "red",
    "pink",
    "gray",
    "blue",
    "white",
  ];
  const correctCombination = ["green", "black", "red", "blue"];

  // Timer logic
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Save game state
  useEffect(() => {
    localStorage.setItem("escapeRoomTime", time.toString());
    localStorage.setItem("escapeRoomKeyboard", JSON.stringify(keyboard));
    localStorage.setItem("escapeRoomLevel", level.toString());
  }, [time, keyboard, level]);

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Helper function to find empty keyboard positions
  const getEmptyKeyboardPositions = () => {
    const emptyPositions = [];
    keyboard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell) {
          emptyPositions.push({ rowIndex, colIndex });
        }
      });
    });
    return emptyPositions;
  };

  // Level 1 functions
  const handleColorSelect = (color) => {
    if (currentPosition < 0 || level !== 1) return;

    const newSelectedColors = [...selectedColors];
    newSelectedColors[currentPosition] = color;
    setSelectedColors(newSelectedColors);
    setCurrentPosition((prev) => prev - 1);
  };

  const checkColorCombination = () => {
    const isCorrect = selectedColors.every(
      (color, index) => color === correctCombination[index],
    );

    if (isCorrect) {
      const emptyPositions = getEmptyKeyboardPositions();
      if (emptyPositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyPositions.length);
        const { rowIndex, colIndex } = emptyPositions[randomIndex];
        const newKeyboard = [...keyboard];
        newKeyboard[rowIndex][colIndex] = "s";
        setKeyboard(newKeyboard);
        setLevel(2);
        setSelectedColors([null, null, null, null]);
        setCurrentPosition(3);
      }
    } else {
      setSelectedColors([null, null, null, null]);
      setCurrentPosition(3);
    }
  };

  // Level 2 functions
  const checkMathAnswer = () => {
    if (userAnswer.toLowerCase() === "p") {
      setShowFeedback("correct");

      const emptyPositions = getEmptyKeyboardPositions();
      if (emptyPositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyPositions.length);
        const { rowIndex, colIndex } = emptyPositions[randomIndex];
        const newKeyboard = [...keyboard];
        newKeyboard[rowIndex][colIndex] = "p";
        setKeyboard(newKeyboard);
      }

      setTimeout(() => {
        setLevel(3);
        setUserAnswer("");
        setShowFeedback(null);
      }, 1500);
    } else {
      setShowFeedback("incorrect");
      setTimeout(() => setShowFeedback(null), 1500);
    }
  };

  // Level 3 functions
  const checkChessAnswer = () => {
    if (userAnswer.toLowerCase() === "e2") {
      setShowFeedback("correct");

      const emptyPositions = getEmptyKeyboardPositions();
      if (emptyPositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyPositions.length);
        const { rowIndex, colIndex } = emptyPositions[randomIndex];
        const newKeyboard = [...keyboard];
        newKeyboard[rowIndex][colIndex] = "e";
        setKeyboard(newKeyboard);
      }

      setTimeout(() => {
        setLevel(4);
        setUserAnswer("");
        setShowFeedback(null);
      }, 1500);
    } else {
      setShowFeedback("incorrect");
      setTimeout(() => setShowFeedback(null), 1500);
    }
  };

  // Level 4 functions
  const [R, setR] = useState(true);
  const RRef = useRef(true);

  useEffect(() => {
    function handleMessage(event) {
      if (event.data >= 10 && RRef.current) {
        RRef.current = false;
        setShowFeedback("correct");

        const emptyPositions = getEmptyKeyboardPositions();
        if (emptyPositions.length > 0) {
          const randomIndex = Math.floor(Math.random() * emptyPositions.length);
          const { rowIndex, colIndex } = emptyPositions[randomIndex];
          const newKeyboard = [...keyboard];
          newKeyboard[rowIndex][colIndex] = "r";
          setKeyboard(newKeyboard);
        }

        setTimeout(() => {
          setLevel(5);
          setUserAnswer("");
          setShowFeedback(null);
        }, 1500);
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Level 5 functions
  const checkAudioAnswers = () => {
    if (
      (userAnswer.toLowerCase() === "a" && userAnswer2.toLowerCase() === "n") ||
      (userAnswer2.toLowerCase() === "a" && userAnswer.toLowerCase() === "n")
    ) {
      setShowFeedback("correct");

      const emptyPositions = getEmptyKeyboardPositions();
      if (emptyPositions.length > 1) {
        const randomIndex = Math.floor(Math.random() * emptyPositions.length);
        const { rowIndex, colIndex } = emptyPositions[randomIndex];
        const newKeyboard = [...keyboard];
        newKeyboard[rowIndex][colIndex] = "a";
        setKeyboard(newKeyboard);
      }
      if (emptyPositions.length > 1) {
        const randomIndex = Math.floor(Math.random() * emptyPositions.length);
        const { rowIndex, colIndex } = emptyPositions[randomIndex];
        const newKeyboard = [...keyboard];
        newKeyboard[rowIndex][colIndex] = "n";
        setKeyboard(newKeyboard);
      }

      setTimeout(() => {
        setLevel(6);
        setUserAnswer("");
        setUserAnswer2("");
        setShowFeedback(null);
      }, 1500);
    } else {
      setShowFeedback("incorrect");
      setTimeout(() => setShowFeedback(null), 1500);
    }
  };

  // Level 6 functions
  const checkClockAnswer = () => {
    if (userAnswer.toLowerCase() === "i") {
      setShowFeedback("correct");

      const emptyPositions = getEmptyKeyboardPositions();
      if (emptyPositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyPositions.length);
        const { rowIndex, colIndex } = emptyPositions[randomIndex];
        const newKeyboard = [...keyboard];
        newKeyboard[rowIndex][colIndex] = "i";
        setKeyboard(newKeyboard);
      }

      setTimeout(() => {
        setLevel(7);
        setUserAnswer("");
        setShowFeedback(null);
      }, 1500);
    } else {
      setShowFeedback("incorrect");
      setTimeout(() => setShowFeedback(null), 1500);
    }
  };

  // Level 7 functions
  const checkFinalAnswer = () => {
    if (userAnswer.toLowerCase() === "gulf") {
      setShowFeedback("correct");

      const emptyPositions = getEmptyKeyboardPositions();
      const letters = ["g", "u", "l", "f"];
    
      letters.forEach((letter, index) => {
        if (emptyPositions.length > index) {
          const { rowIndex, colIndex } = emptyPositions[index];
          const newKeyboard = [...keyboard];
          newKeyboard[rowIndex][colIndex] = letter;
          setKeyboard(newKeyboard);
        }
      });

      setTimeout(() => {
        setLevel(8);
        setUserAnswer("");
        setShowFeedback(null);
      }, 1500);
    } else {
      setShowFeedback("incorrect");
      setTimeout(() => setShowFeedback(null), 1500);
    }
  };

  // Level 8 functions - Persian Gulf final answer
  const checkPersianGulfAnswer = () => {
    if (userAnswer.toLowerCase() === "persian gulf") {
      setShowFeedback("great");
      setIsTimerRunning(false); // Stop the timer
      
      setTimeout(() => {
        setShowCongrats(true);
        setShowFeedback(null);
      }, 2000);
    } else {
      setShowFeedback("incorrect");
      setTimeout(() => setShowFeedback(null), 1500);
    }
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
    // You can add any additional logic here after video ends
  };

  return (
    <div className="game-container">
      {/* Persistent Timer */}
      {!showCongrats && !showVideo && (
        <div className="timer">{formatTime()}</div>
      )}

      {/* Level 1 - Color Combination */}
      {level === 1 && (
        <>
          <div className="hint-text">
            با هر رنگ یه تکه از قصه ما تکمیل میشه فقط حواست به ترتیبشون باشه
          </div>

          <div className="target-squares">
            {selectedColors.map((color, index) => (
              <div
                key={index}
                className="target-square"
                style={{
                  backgroundColor: color || "transparent",
                  border: color ? "none" : "2px dashed #666",
                }}
              />
            ))}
          </div>

          <button
            className="submit-button"
            onClick={checkColorCombination}
            disabled={currentPosition >= 0}
          >
            تایید
          </button>

          <div className="color-options">
            {colorOptions.map((color) => (
              <button
                key={color}
                className="color-button"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
        </>
      )}

      {/* Level 2 - Math Riddle */}
      {level === 2 && (
        <div className="level-container">
          <div className="riddle-instruction">اولین حرف رمز رو پیدا کن</div>

          <div className="blockmath" dir="ltr">
            <BlockMath math="\int_0^\pi dx" />
          </div>

          <div className="answer-section">
            <input
              dir="ltr"
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              maxLength="1"
              className="answer-input"
              placeholder="?"
            />
            <button
              onClick={checkMathAnswer}
              className="submit-button"
              disabled={!userAnswer}
            >
              تایید
            </button>
          </div>

          {showFeedback === "correct" && (
            <div className="feedback correct">
              پاسخ صحیح! حرف "p" به کیبورد اضافه شد.
            </div>
          )}
          {showFeedback === "incorrect" && (
            <div className="feedback incorrect">
              پاسخ نادرست! دوباره تلاش کنید.
            </div>
          )}
        </div>
      )}

      {/* Level 3 - Chess */}
      {level === 3 && (
        <div className="level-container">
          <div className="riddle-instruction">بهترین حرکت رو پیدا کن</div>

          <div className="answer-section">
            <img
              src={chess}
              alt="شطرنج"
              className="chess-image"
              width={"50%"}
              style={{ margin: "auto" }}
            />
            <div className="inline" dir="rtl">
              <input
                dir="ltr"
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                maxLength="2"
                className="answer-input"
                style={{ marginBottom: "0px" }}
                placeholder="?"
              />
              <img
                src={queen}
                alt="ملکه شطرنج"
                className="queen-image"
                width={"100px"}
              />
              <div style={{ fontSize: "4rem", marginLeft: "5px" }}>#</div>
            </div>
            <button
              onClick={checkChessAnswer}
              className="submit-button"
              disabled={!userAnswer}
            >
              تایید
            </button>
          </div>

          {showFeedback === "correct" && (
            <div className="feedback correct">
              پاسخ صحیح! حرف "e" به کیبورد اضافه شد.
            </div>
          )}
          {showFeedback === "incorrect" && (
            <div className="feedback incorrect">
              پاسخ نادرست! دوباره تلاش کنید.
            </div>
          )}
        </div>
      )}

      {/* Level 4 - Din */}
      {level === 4 && (
        <div className="level-container">
          <div className="riddle-instruction"></div>

          <div className="answer-section">
            <iframe src="./din.html" style={{ width: "400px" }}></iframe>
          </div>

          {showFeedback === "correct" && (
            <div className="feedback correct">
              پاسخ صحیح! حرف "r" به کیبورد اضافه شد.
            </div>
          )}
          {showFeedback === "incorrect" && (
            <div className="feedback incorrect">
              پاسخ نادرست! دوباره تلاش کنید.
            </div>
          )}
        </div>
      )}

      {/* Level 5 - Audio */}
      {level === 5 && (
        <div className="level-container">
          <div className="riddle-instruction">وویس!</div>

          <div className="answer-section">
            <AudioPlayer src="./specialvoice.m4a" />
            <div className="inline" dir="ltr">
              <input
                dir="ltr"
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                maxLength="1"
                className="answer-input"
                style={{ marginBottom: "0px" }}
                placeholder="?"
              />
              <input
                dir="ltr"
                type="text"
                value={userAnswer2}
                onChange={(e) => setUserAnswer2(e.target.value)}
                maxLength="1"
                className="answer-input"
                style={{ marginLeft: "10px", marginBottom: "0px" }}
                placeholder="?"
              />
            </div>
            <button
              onClick={checkAudioAnswers}
              className="submit-button"
              disabled={!userAnswer}
            >
              تایید
            </button>
          </div>

          {showFeedback === "correct" && (
            <div className="feedback correct">
              پاسخ صحیح! حروف "a" و "n" به کیبورد اضافه شدند.
            </div>
          )}
          {showFeedback === "incorrect" && (
            <div className="feedback incorrect">
              پاسخ نادرست! دوباره تلاش کنید.
            </div>
          )}
        </div>
      )}

      {/* Level 6 - Clock */}
      {level === 6 && (
        <div className="level-container">
          <div
            className="riddle-instruction"
            style={{ fontSize: "0.95rem", marginTop: "50px" }}
          >
            زمان یکی از مهمترین المان های زندگیه ، هیچ وقت دست کمش نگیر
          </div>

          <div className="answer-section">
            <div className="inline" dir="ltr">
              <input
                dir="ltr"
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                maxLength="1"
                className="answer-input"
                style={{ marginBottom: "0px" }}
                placeholder="?"
              />
            </div>
            <button
              onClick={checkClockAnswer}
              className="submit-button"
              disabled={!userAnswer}
            >
              تایید
            </button>
          </div>

          {showFeedback === "correct" && (
            <div className="feedback correct">
              پاسخ صحیح! حرف "i" به کیبورد اضافه شد.
            </div>
          )}
          {showFeedback === "incorrect" && (
            <div className="feedback incorrect">
              پاسخ نادرست! دوباره تلاش کنید.
            </div>
          )}
        </div>
      )}

      {/* Level 7 - Final */}
      {level === 7 && (
        <div className="level-container">
          <div
            className="riddle-instruction"
            style={{ fontSize: "0.95rem", marginTop: "50px" }}
          >
            کلمه مشترک رو پیدا کن و به انگلیسی تبدیلش کن
          </div>
          <div
            className="riddle-instruction"
            style={{ fontSize: "0.95rem", marginTop: "1rem" }}
          >
            کلمه چهار حرفی هستش
          </div>

          <div className="answer-section">
            <div className="inline" dir="ltr">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "space-around",
                  marginTop: "20px",
                }}
              >
                <audio
                  src="./1.mpeg"
                  controls
                  style={{ marginBottom: "0.5rem" }}
                ></audio>
                <audio src="./2.mpeg" controls></audio>
                <input
                  dir="ltr"
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  maxLength="4"
                  className="answer-input"
                  style={{ margin: "auto", marginTop: "0.5rem", width: "10rem" }}
                  placeholder="?"
                />
              </div>
            </div>
            <button
              onClick={checkFinalAnswer}
              className="submit-button"
              disabled={!userAnswer}
              style={{ marginTop: "5rem" }}
            >
              تایید
            </button>
          </div>

          {showFeedback === "correct" && (
            <div className="feedback correct">
              پاسخ صحیح! کلمه "gulf" به کیبورد اضافه شد.
            </div>
          )}
          {showFeedback === "incorrect" && (
            <div className="feedback incorrect">
              پاسخ نادرست! دوباره تلاش کنید.
            </div>
          )}
        </div>
      )}

      {/* Level 8 - Persian Gulf Final Answer */}
      {level === 8 && (
        <div className="level-container">
          <div
            className="riddle-instruction"
            style={{ fontSize: "1.2rem", marginTop: "50px" }}
          >
            حالا نام کامل را به انگلیسی وارد کنید
          </div>

          <div className="answer-section">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="answer-input"
              style={{ width: "200px" }}
              placeholder="?"
            />
            <button
              onClick={checkPersianGulfAnswer}
              className="submit-button"
              disabled={!userAnswer}
            >
              تایید
            </button>
          </div>

          {showFeedback === "great" && (
            <div className="feedback great">
              آفرین! پاسخ صحیح "Persian Gulf" است!
            </div>
          )}
          {showFeedback === "incorrect" && (
            <div className="feedback incorrect">
              پاسخ نادرست! دوباره تلاش کنید.
            </div>
          )}
        </div>
      )}

      {/* Congratulations and Video */}
      {showCongrats && (
        <div className="congrats-container">
          <h2>تبریک! شما بازی را به پایان رساندید!</h2>
          <p>زمان نهایی شما: {formatTime()}</p>
          <button 
            onClick={() => setShowVideo(true)}
            className="submit-button"
            style={{ marginTop: "20px" }}
          >
            پخش ویدیو
          </button>
        </div>
      )}

      {showVideo && (
        <div className="video-overlay">
          <div className="video-container">
            <video
              controls
              autoPlay
              onEnded={handleVideoEnd}
              style={{ width: "80%", maxWidth: "800px" }}
            >
              <source src="./3.mp4" type="video/mp4" />
              مرورگر شما از ویدیو پشتیبانی نمی‌کند.
            </video>
            <button
              onClick={() => setShowVideo(false)}
              className="submit-button"
              style={{ marginTop: "20px" }}
            >
              بستن ویدیو
            </button>
          </div>
        </div>
      )}

      {/* Persistent Keyboard */}
      {!showCongrats && !showVideo && (
        <div className="keyboard-container">
          {keyboard.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="keyboard-row">
              {row.map((key, colIndex) => (
                <div key={`key-${rowIndex}-${colIndex}`} className="key">
                  {key || "[ ]"}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamePage;