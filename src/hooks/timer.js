import { useState, useRef } from 'react';

export function useTimer(timerAmount = 60) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef(null);

  const start = () => {
    if (!isRunning && !isFinished) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime + 1 >= timerAmount) {
            clearInterval(timerRef.current); // Зупиняємо таймер
            setIsRunning(false);
            setIsFinished(true);
            return timerAmount; // Задаємо час рівним timerAmount
          }
          return prevTime + 1; // Збільшуємо час
        });
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
    setIsFinished(false); // Скидаємо стан завершення
  };

  return { time, isRunning, isFinished, start, pause, reset };
}