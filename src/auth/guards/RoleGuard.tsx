import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../hooks';

interface Props {
    allowedRoles: string[];
}

export const RoleGuard = ({ allowedRoles }: Props) => {
    const { role } = useAuthStore();

    if (!role) return <Navigate to="/login" replace />;

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

