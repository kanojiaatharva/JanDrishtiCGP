import api from './axios';
import type { AuthResponse } from '../types';

// The backend returns: { token, id, name, email, role }
// We normalize it to: { token, user: { id, name, email, role } }
type BackendAuthResponse = {
    token: string;
    id: number;
    name: string;
    email: string;
    role: 'CITIZEN' | 'OFFICER';
};

function normalize(raw: BackendAuthResponse): AuthResponse {
    return {
        token: raw.token,
        user: {
            id: raw.id,
            name: raw.name,
            email: raw.email,
            role: raw.role,
            phone: '',
            preferredLanguage: 'en',
        },
    };
}

export const authApi = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<BackendAuthResponse>('/auth/login', { email, password });
        return normalize(response.data);
    },
    register: async (data: any): Promise<AuthResponse> => {
        const response = await api.post<BackendAuthResponse>('/auth/register', data);
        return normalize(response.data);
    },
};
