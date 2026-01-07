import { useEffect, useState } from 'react';
import { getEstadoPagoVenta } from '../services';

export const usePagoResultado = (ventaId: string | null) => {
    const [estado, setEstado] = useState<'PENDIENTE' | 'PAGADA' | 'RECHAZADA'>('PENDIENTE');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ventaId) return;

        const interval = setInterval(async () => {
            try {
                const result = await getEstadoPagoVenta(ventaId);

                if (result.estado_venta === 'PAGADA') {
                    setEstado('PAGADA');
                    clearInterval(interval);
                }

                if (result.estado_pago === 'RECHAZADO') {
                    setEstado('RECHAZADA');
                    clearInterval(interval);
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        }, 3000); // cada 3 segundos

        return () => clearInterval(interval);
    }, [ventaId]);

    return { estado, loading };
};
