import React from 'react';

interface PaymentSummaryProps {
    currentTotal: number;
    totalPagado: number;
    restante: number;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
    currentTotal,
    totalPagado,
    restante,
}) => {
    return (
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl border border-gray-700 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
                <p className="text-gray-400 text-sm">Total a Pagar</p>
                <p className="text-3xl font-bold">${currentTotal.toLocaleString()}</p>
            </div>
            <div className="flex gap-8">
                <div className="text-center">
                    <p className="text-gray-400 text-sm">Pagado</p>
                    <p className="text-xl text-green-400 font-medium">${totalPagado.toLocaleString()}</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-400 text-sm">Restante</p>
                    <p className={`text-xl font-medium ${restante > 0 ? 'text-red-400' : 'text-gray-500'}`}>
                        ${restante.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};
