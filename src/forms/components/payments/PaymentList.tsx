
import React from 'react';
import type { MetodoPago, PagoParcial } from '../../../types/Pago';

interface PaymentListProps {
    pagos: (PagoParcial & { estado?: string })[];
    handleRemovePayment: (index: number) => void;
}

const metodos: { id: MetodoPago; label: string; icon: string }[] = [
    { id: 'EFECTIVO', label: 'Efectivo', icon: '💵' },
    { id: 'TRANSFERENCIA', label: 'Transferencia', icon: '🏦' },
    { id: 'MP', label: 'Mercado Pago', icon: '📱' },
];

export const PaymentList: React.FC<PaymentListProps> = ({ pagos, handleRemovePayment }) => {
    return (
        <div className="bg-gray-900 bg-opacity-30 p-4 rounded-xl min-h-[150px]">
            <h3 className="text-lg font-medium mb-3">Pagos Agregados</h3>
            {pagos.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No hay pagos registrados aún.</p>
            ) : (
                <div className="space-y-2">
                    {pagos.map((pago, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700 ${pago.confirmed ? 'border-green-800 bg-green-900/10' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{metodos.find(m => m.id === pago.metodo)?.icon || '💰'}</span>
                                <div>
                                    <p className="font-medium">{metodos.find(m => m.id === pago.metodo)?.label || pago.metodo}</p>
                                    <p className={`text-xs ${pago.confirmed ? 'text-green-400' : 'text-yellow-500'}`}>
                                        {pago.confirmed ? 'CONFIRMADO' : pago.estado || 'Pendiente / Local'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-lg">${(pago.monto || 0).toLocaleString()}</span>
                                {!pago.readonly && (
                                    <button
                                        onClick={() => handleRemovePayment(idx)}
                                        className="text-red-400 hover:text-red-300 transition p-1"
                                    >
                                        ✕
                                    </button>
                                )}
                                {pago.confirmed && <span className="text-green-500">✓</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
