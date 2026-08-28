import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="loading-state loading-state--full">
                <Loader2 className="spinner" size={20} />
                <span>Loading your session...</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect depending on role if they try to access unauthorized pages
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'owner') return <Navigate to="/owner" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
