import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Countdown timer hook.
 * @param {number} initialSeconds   Total seconds to count down from.
 * @param {Function} onExpire       Called when the timer reaches 0.
 * @returns {{ timeLeft, isRunning, start, pause, reset }}
 */
export function useTimer(initialSeconds, onExpire) {
  const [timeLeft,   setTimeLeft]   = useState(initialSeconds);
  const [isRunning,  setIsRunning]  = useState(false);
  const intervalRef = useRef(null);

  const clear = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clear();
          setIsRunning(false);
          onExpire?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clear;
  }, [isRunning, onExpire]);

  const start  = useCallback(() => setIsRunning(true),  []);
  const pause  = useCallback(() => { clear(); setIsRunning(false); }, []);
  const reset  = useCallback((secs = initialSeconds) => {
    clear();
    setIsRunning(false);
    setTimeLeft(secs);
  }, [initialSeconds]);

  return { timeLeft, isRunning, start, pause, reset };
}
