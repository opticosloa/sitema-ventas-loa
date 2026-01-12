import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { usePagoResultado } from '../../hooks';
import { useReactToPrint } from 'react-to-print';
import { TicketVenta } from '../../components/print/TicketVenta';

export const PagoResultadoPage = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const ventaId = params.get('venta_id');

    const { estado, loading } = usePagoResultado(ventaId);

    // Ticket Printing
    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Ticket_${ventaId}`,
    });

    if (loading) {
        return <p className="text-center mt-10">Verificando pago…</p>;
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

    if (estado === 'PENDIENTE') {
        return (
            <div className="flex flex-col items-center mt-10 gap-4 text-orange-500">
                <h2 className="text-xl font-bold">Pago Pendiente / A Cuenta</h2>
                <p>La venta se registró correctamente. El pago total no está confirmado.</p>
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition shadow-lg border border-gray-600"
                    >
                        🖨️ Imprimir Ticket
                    </button>
                    <button
                        onClick={() => navigate('/ventas')}
                        className="px-6 py-3 bg-celeste text-white rounded-lg hover:bg-celeste/80 transition shadow-lg"
                    >
                        Volver al Inicio
                    </button>
                </div>
                {/* Hidden Ticket Component for Printing */}
                <div style={{ display: 'none' }}>
                    <TicketVenta ref={componentRef} saleId={ventaId || ''} />
                </div>
            </div>
        );
    }

    // PAGADA or Default
    return (
        <div className="text-center mt-10 text-green-600 flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold">Pago Aprobado</h2>
            <p>La venta se registró correctamente.</p>

            <div className="flex gap-4 mt-4">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition shadow-lg border border-gray-600"
                >
                    🖨️ Imprimir Ticket
                </button>

                <button
                    onClick={() => navigate('/ventas')}
                    className="px-6 py-3 bg-celeste text-white rounded-lg hover:bg-celeste/80 transition shadow-lg"
                >
                    Volver al Inicio
                </button>
            </div>

            {/* Hidden Ticket Component for Printing */}
            <div style={{ display: 'none' }}>
                <TicketVenta ref={componentRef} saleId={ventaId || ''} />
            </div>
        </div>
    );
};
