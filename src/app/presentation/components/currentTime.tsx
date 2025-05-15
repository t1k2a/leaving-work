"use client";

import React, { useState, useEffect } from "react";

const CurrentTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // ページが読み込まれたときに時刻を更新し、1秒ごとに更新を続ける
    const now: Date = new Date();
    const formatted: string = now.toLocaleTimeString("ja-JP");
    setCurrentTime(formatted);

    const interval: NodeJS.Timeout = setInterval(() => {
      const newNow: Date = new Date();
      const newTimeString: string = newNow.toLocaleTimeString("ja-JP");
      setCurrentTime(newTimeString);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div id="current-time">{currentTime}</div>;
};

export default CurrentTime;
