"use client";

import React, { useState, useEffect } from "react";

const CurrentTime: React.FC = () => {
  const [currenTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // ページが読み込まれたときに時刻を更新し、1秒ごとに更新を続ける
    const now = new Date();
    const formatted = now.toLocaleTimeString("ja-JP");
    setCurrentTime(formatted);

    const interval = setInterval(() => {
      const newNow = new Date();
      const newTimeString = newNow.toLocaleTimeString("ja-JP");
      setCurrentTime(newTimeString);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div id="current-time">{currenTime}</div>;
};

export default CurrentTime;
