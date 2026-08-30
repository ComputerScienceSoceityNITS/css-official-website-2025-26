// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireProfileCompletion = false }) => {
    const { user, loading, requiresProfileCompletion, requiresOnboarding } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-arch-card flex items-center justify-center text-arch-ink">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-arch-line mx-auto"></div>
                    <p className="mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (requiresOnboarding || (requireProfileCompletion && requiresProfileCompletion)) {
        return <Navigate to="/onboarding" replace />;
    }

    return children;
};

export default ProtectedRoute;