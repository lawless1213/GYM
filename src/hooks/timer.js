import { useState, useRef } from "react";

export function useTimer(timerAmount = 60) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef(null);

  const start = () => {
    if (!isRunning && !isFinished && !timerRef.current) { // Додано перевірку timerRef.current
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime + 1 >= timerAmount) {
            clearInterval(timerRef.current);
            timerRef.current = null; // Очищення рефу
            setIsRunning(false);
            setIsFinished(true);
            return timerAmount;
          }
          console.log(prevTime);
          return prevTime + 1;
        });
      }, 1000);
    }
  };

  const pause = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      timerRef.current = null; // Очищення рефу
      setIsRunning(false);
    }
  };

  const reset = () => {
    clearInterval(timerRef.current);
    timerRef.current = null; // Очищення рефу
    setTime(0);
    setIsRunning(false);
    setIsFinished(false);
  };

  return { time, isRunning, isFinished, start, pause, reset };
}
