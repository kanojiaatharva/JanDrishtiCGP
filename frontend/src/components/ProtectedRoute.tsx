import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute: React.FC<{ allowedRoles?: ('CITIZEN' | 'OFFICER')[] }> = ({ allowedRoles }) => {
    const { user, token } = useAuth();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their respective home page if they try to access wrong role route
        return <Navigate to={user.role === 'OFFICER' ? '/officer' : '/citizen'} replace />;
    }

    return <Outlet />;
};
