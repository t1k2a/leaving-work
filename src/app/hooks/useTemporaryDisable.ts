import { useState, useRef, useEffect, useCallback } from 'react';

export const useTemporaryDisable = (): [boolean, () => void] => {
  const [isDisabled, setIsDisabled] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const TEMPORARY_DISABLE_DURATION_MS = 500;
  const disable = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsDisabled(true);
    timerRef.current = setTimeout(() => {
      setIsDisabled(false);
      timerRef.current = null;
    }, TEMPORARY_DISABLE_DURATION_MS);
  }, [TEMPORARY_DISABLE_DURATION_MS]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return [isDisabled, disable];
};