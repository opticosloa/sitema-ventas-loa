import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../hooks';

export const AuthGuard = () => {
    const { status } = useAuthStore();

    if (status === 'checking') {
        return null; // o loader
    }

    if (status !== 'authenticated') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
