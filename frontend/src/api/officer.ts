import api from './axios';
import type { DemandCluster } from '../types';

export const officerApi = {
    getSummary: async (): Promise<any> => {
        const response = await api.get('/officer/dashboard/summary');
        return response.data;
    },
    getClusters: async (): Promise<DemandCluster[]> => {
        const response = await api.get<DemandCluster[]>('/officer/clusters');
        return response.data;
    },
    getCluster: async (id: number): Promise<DemandCluster> => {
        const response = await api.get<DemandCluster>(`/officer/clusters/${id}`);
        return response.data;
    },
    makeDecision: async (id: number, decision: 'APPROVED' | 'MODIFIED' | 'REJECTED', comment?: string): Promise<any> => {
        const response = await api.post(`/officer/clusters/${id}/decision`, { decision, comment });
        return response.data;
    }
};
