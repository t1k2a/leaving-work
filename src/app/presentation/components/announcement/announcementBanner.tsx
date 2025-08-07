'use client';

import { useState, useEffect } from 'react';
import styles from '../../styles/announcement.module.css';
import { Announcement } from '@/types/announcement'

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetch('/announcements.json')
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        const activeAnnouncements = data.announcements.filter((item: Announcement) => {
          if (!item.isActive) return false;
          const startDate = new Date(item.startDate);
          const endDate = new Date(item.endDate);
          return now >= startDate && now <= endDate && item.priority === 'high';
        });
        
        if (activeAnnouncements.length > 0) {
          setAnnouncement(activeAnnouncements[0]);
        }
      })
      .catch(err => console.error('Failed to fetch announcements:', err));
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
      case 'maintenance': return '⚠️';
      case 'info': return 'ℹ️';
      case 'warning': return '🚨';
      case 'update': return '🆕';
      default: return '📢';
    }
  };

  if (!announcement || !isVisible) return null;

  return (
    <div className={`${styles.announcementBanner} ${styles[announcement.type]}`}>
      <div className={styles.bannerContent}>
        <span className={styles.bannerIcon}>{getIcon(announcement.type)}</span>
        <div className={styles.bannerText}>
          <div className={styles.bannerTitle}>{announcement.title}</div>
          <div className={styles.bannerMessage}>{announcement.message}</div>
        </div>
      </div>
      <button 
        className={styles.bannerClose}
        onClick={() => setIsVisible(false)}
        aria-label="閉じる"
      >
        ×
      </button>
    </div>
  );
}