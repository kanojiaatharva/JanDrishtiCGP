import api from './axios';
import type { Notification } from '../types';

export const notificationsApi = {
    getAll: async (): Promise<Notification[]> => {
        const response = await api.get<Notification[]>('/notifications');
        return response.data;
    },
    markRead: async (id: number): Promise<void> => {
        await api.patch(`/notifications/${id}/read`);
    },
    markAllRead: async (): Promise<void> => {
        await api.patch('/notifications/read-all');
    },
};
