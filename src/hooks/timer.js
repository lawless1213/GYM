import { useState, useRef } from 'react';

export function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1); 
      }, 1000);
    }
  };

  const pause = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setTime(0);
    setIsRunning(false);
  };

  return { time, isRunning, start, pause, reset };
}