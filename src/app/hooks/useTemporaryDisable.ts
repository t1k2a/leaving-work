import { useState, useRef, useEffect, useCallback } from 'react';

const DEFAULT_DISABLE_DURATION_MS = 2000;

export const useTemporaryDisable = (duration: number = DEFAULT_DISABLE_DURATION_MS): [boolean, () => void] => {
  const [isDisabled, setIsDisabled] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disable = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsDisabled(true);
    timerRef.current = setTimeout(() => {
      setIsDisabled(false);
      timerRef.current = null;
    }, duration);
  }, [duration]);

  useEffect(() => {
    // アンマウント時のクリーンアップ
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return [isDisabled, disable];
};