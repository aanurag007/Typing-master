import React, { useState, useEffect, useRef } from 'react';
import './TypingTest.css';

const TIME_LIMIT = 60;
const quotesArray = [
  "Push yourself, because no one else is going to do it for you.",
  "Failure is the condiment that gives success its flavor.",
  "Wake up with determination. Go to bed with satisfaction.",
  "It's going to be hard, but hard does not mean impossible.",
  "Learning never exhausts the mind.",
  "The only way to do great work is to love what you do."
];

function TypingTest() {
  const [quote, setQuote] = useState('');
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [errors, setErrors] = useState(0);
  const [characterTyped, setCharacterTyped] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const quoteIndex = useRef(0);
  const timer = useRef(null);

  // Load a new quote and reset input
  const updateQuote = () => {
    setQuote(quotesArray[quoteIndex.current]);
    setInputText('');
    quoteIndex.current = (quoteIndex.current + 1) % quotesArray.length;
  };

  // Start the game
  const startGame = () => {
    if (!isGameActive) { // Start the game only if it's not active
      resetGame();
      setIsGameActive(true);
      updateQuote();
      timer.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
  };

  // Reset game
  const resetGame = () => {
    clearInterval(timer.current);
    setTimeLeft(TIME_LIMIT);
    setErrors(0);
    setCharacterTyped(0);
    setWpm(0);
    setCpm(0);
    setAccuracy(100);
    setIsGameActive(false);
    updateQuote();
  };

  // Handle text input and calculate stats
  const handleInputChange = (e) => {
    const inputVal = e.target.value;
    setInputText(inputVal);
    setCharacterTyped((prev) => prev + 1);

    const currentQuote = quote;
    let localErrors = 0;

    inputVal.split('').forEach((char, index) => {
      if (char !== currentQuote[index]) localErrors++;
    });

    setErrors(localErrors);
    const correctChars = characterTyped - localErrors;
    setAccuracy(((correctChars / characterTyped) * 100).toFixed(0));

    if (inputVal.length === currentQuote.length) {
      setInputText('');  
      setErrors(0);      // Reset errors for new quote
      updateQuote();
    }
  };

  // Update timer and calculate WPM and CPM
  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(timer.current);
      setIsGameActive(false);
      setCpm(Math.round((characterTyped / TIME_LIMIT) * 60));
      setWpm(Math.round((characterTyped / 5 / TIME_LIMIT) * 60));
    }
  }, [timeLeft, characterTyped]);

  return (
    <div className="container">
      <div className="heading">Simple Speed Typing</div>
      <div className="header">
        <div className="wpm"><div className="header_text">WPM</div><div className="curr_wpm">{wpm}</div></div>
        <div className="cpm"><div className="header_text">CPM</div><div className="curr_cpm">{cpm}</div></div>
        <div className="errors"><div className="header_text">Errors</div><div className="curr_errors">{errors}</div></div>
        <div className="timer"><div className="header_text">Time</div><div className="curr_time">{timeLeft}s</div></div>
        <div className="accuracy"><div className="header_text">% Accuracy</div><div className="curr_accuracy">{accuracy}</div></div>
      </div>
      
      <div className="quote">
        {quote.split('').map((char, index) => (
          <span
            key={index}
            className={
              index < inputText.length
                ? inputText[index] === char
                  ? 'correct_char'
                  : 'incorrect_char'
                : ''
            }
          >
            {char}
          </span>
        ))}
      </div>

      {/* Start button */}
      <button className="start_btn" onClick={startGame}>Start</button>

      <textarea
        className="input_area"
        placeholder="Start typing here..."
        onChange={handleInputChange}
        value={inputText}
        disabled={!isGameActive}
      />

      <button className="restart_btn" onClick={resetGame}>Restart</button>
    </div>
  );
}

export default TypingTest;
