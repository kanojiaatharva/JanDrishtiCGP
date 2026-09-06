import React, { createContext, useContext, useState } from 'react';
import type { User, AuthResponse } from '../types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (response: AuthResponse) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null;
        } catch {
            localStorage.removeItem('user');
            return null;
        }
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [isLoading] = useState(false);

    const login = (response: AuthResponse) => {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
