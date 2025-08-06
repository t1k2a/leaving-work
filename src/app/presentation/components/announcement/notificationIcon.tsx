'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/announcement.module.css';
import NotificationPopover from './notificationPopover';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'maintenance' | 'info' | 'warning' | 'update';
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export default function NotificationIcon() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showPopover, setShowPopover] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/announcements.json')
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data.announcements);
      })
      .catch(err => console.error('Failed to fetch announcements:', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className={styles.notificationContainer}>
      <button
        ref={buttonRef}
        className={styles.notificationButton}
        onClick={() => setShowPopover(!showPopover)}
        aria-label="お知らせ"
      >
        <svg className={styles.notificationIcon} viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        {announcements.length > 0 && (
          <span className={styles.notificationBadge}>
            {announcements.length}
          </span>
        )}
      </button>
      
      {showPopover && (
        <div ref={popoverRef}>
          <NotificationPopover 
            announcements={announcements}
            onClose={() => setShowPopover(false)}
          />
        </div>
      )}
    </div>
  );
}