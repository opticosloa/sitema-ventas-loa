import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { usePagoResultado } from '../../hooks';

export const PagoResultadoPage = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const ventaId = params.get('venta_id');

    const { estado, loading } = usePagoResultado(ventaId);

    useEffect(() => {
        if (estado === 'PAGADA') {
            setTimeout(() => {
                navigate(`/ventas/${ventaId}`);
            }, 2000);
        }
    }, [estado]);

    if (loading) {
        return <p className="text-center mt-10">Verificando pago…</p>;
    }

    if (estado === 'PENDIENTE') {
        return (
            <div className="text-center mt-10">
                <h2 className="text-xl">Pago pendiente</h2>
                <p>Estamos esperando la confirmación del pago.</p>
            </div>
        );
    }

    if (estado === 'RECHAZADA') {
        return (
            <div className="flex flex-col items-center mt-10 text-red-600 gap-4">
                <h2 className="text-xl">Pago rechazado</h2>
                <p>Intentá nuevamente o usá otro medio de pago.</p>
                <button
                    onClick={() => navigate('/empleado/nueva-venta/pago', { state: { ventaId } })}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    Reintentar Pago
                </button>
            </div>
        );
    }

    return (
        <div className="text-center mt-10 text-green-600">
            <h2 className="text-xl">Pago aprobado</h2>
            <p>Redirigiendo…</p>
        </div>
    );
};
