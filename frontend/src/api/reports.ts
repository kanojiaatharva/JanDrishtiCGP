import api from './axios';
import type { Report } from '../types';

export const reportsApi = {
    getMyReports: async (): Promise<Report[]> => {
        const response = await api.get<Report[]>('/reports/my');
        return response.data;
    },
    getReport: async (id: number): Promise<Report> => {
        const response = await api.get<Report>(`/reports/${id}`);
        return response.data;
    },
    createReport: async (data: any): Promise<Report> => {
        const response = await api.post<Report>('/reports', data);
        return response.data;
    }
};
