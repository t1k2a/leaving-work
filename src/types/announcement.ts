export interface Announcement {
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