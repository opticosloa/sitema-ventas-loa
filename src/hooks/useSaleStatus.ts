import { useEffect, useRef, useState } from 'react';
import LOAApi from '../api/LOAApi';

type SaleStatus = 'PENDIENTE' | 'PAGADA' | 'CANCELADA' | 'ERROR';

export const useSaleStatus = (ventaId: string | null) => {
    const [status, setStatus] = useState<SaleStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!ventaId) return;

        const fetchStatus = async () => {
            try {
                setLoading(true);
                const { data } = await LOAApi.get(`/ventas/${ventaId}`);

                const estado = data?.result?.[0]?.estado;
                if (estado) {
                    setStatus(estado);

                    if (estado === 'PAGADA' || estado === 'CANCELADA') {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                setStatus('ERROR');
            } finally {
                setLoading(false);
            }
        };

        // primera llamada inmediata
        fetchStatus();

        // polling cada 4 segundos
        intervalRef.current = setInterval(fetchStatus, 4000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [ventaId]);

    return { status, loading };
};
