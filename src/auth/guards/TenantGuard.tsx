import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../hooks';

export const TenantGuard = () => {
    const { sucursal_id } = useAuthStore();

    if (!sucursal_id) {
        return <Navigate to="/select-sucursal" replace />;
    }

    return <Outlet />;
};
