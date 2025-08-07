'use client';

import styles from '../../styles/announcement.module.css';

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

interface NotificationPopoverProps {
  announcements: Announcement[];
  onClose: () => void;
}

export default function NotificationPopover({ announcements, onClose }: NotificationPopoverProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  };

  return (
    <div className={styles.notificationPopover}>
      <div className={styles.popoverHeader}>
        <span className={styles.popoverTitle}>お知らせ</span>
      </div>
      
      <div className={styles.notificationList}>
        {announcements.length === 0 ? (
          <div className={styles.emptyState}>
            <p>現在お知らせはありません</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className={styles.notificationItem}>
              <div className={`${styles.notificationIndicator} ${styles[announcement.type]}`} />
              <div className={styles.notificationContent}>
                <div className={styles.notificationTitle}>{announcement.title}</div>
                <div className={styles.notificationDate}>
                  {formatDate(announcement.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}