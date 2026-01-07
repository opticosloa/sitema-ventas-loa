import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../hooks';

export const UnAuthorized = () => {
    const navigate = useNavigate();
    const { role } = useAuthStore();

    const goHome = () => {
        switch (role) {
            case 'SUPERADMIN':
            case 'ADMIN':
                navigate('/admin');
                break;
            case 'EMPLEADO':
                navigate('/empleado');
                break;
            case 'TALLER':
                navigate('/taller');
                break;
            default:
                navigate('/login');
                break;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-azul to-celeste text-blanco text-center px-6">

            <h1 className="text-8xl md:text-9xl font-bold">403</h1>

            <h2 className="text-2xl md:text-3xl mt-4 font-semibold">
                Acceso no autorizado
            </h2>

            <p className="mt-4 text-crema max-w-xl">
                No tenés permisos para acceder a esta sección.
                Si creés que esto es un error, contactá a un administrador.
            </p>

            <button
                onClick={goHome}
                className="mt-8 px-8 py-3 bg-blanco text-azul font-semibold rounded-lg shadow-lg 
                   hover:bg-crema hover:text-azul transition duration-300"
            >
                Volver al inicio
            </button>
        </div>
    );
};
