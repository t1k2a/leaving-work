import { useState, useRef, useEffect, useCallback } from 'react';

export const useTemporaryDisable = (duration: number = 500): [boolean, () => void] => {
  const [isDisabled, setIsDisabled] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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