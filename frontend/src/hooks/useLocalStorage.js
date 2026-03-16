import { useCallback, useState } from "react";

/**
 * useState that persists its value to localStorage.
 * @param {string} key       localStorage key
 * @param {*}      initial   fallback initial value
 */
export function useLocalStorage(key, initial) {
  const [state, setInternalState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  const setState = useCallback((valueOrUpdater) => {
    setInternalState((prev) => {
      const next = typeof valueOrUpdater === "function"
        ? valueOrUpdater(prev)
        : valueOrUpdater;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch { /* storage full or blocked */ }
      return next;
    });
  }, [key]);

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setInternalState(initial);
  }, [key, initial]);

  return [state, setState, remove];
}
