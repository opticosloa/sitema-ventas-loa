import React from 'react';
import type { MetodoPago } from '../../../types/Pago';

interface AddPaymentFormProps {
    selectedMethod: MetodoPago | '';
    setSelectedMethod: (m: MetodoPago | '') => void;
    amountInput: string;
    setAmountInput: (val: string) => void;
    handleAddPayment: () => void;
    currentTotal: number;
}

const metodos: { id: MetodoPago; label: string; icon: string }[] = [
    { id: 'EFECTIVO', label: 'Efectivo', icon: '💵' },
    { id: 'TRANSFERENCIA', label: 'Transferencia', icon: '🏦' },
    { id: 'MP', label: 'Mercado Pago', icon: '📱' },
];

export const AddPaymentForm: React.FC<AddPaymentFormProps> = ({
    selectedMethod,
    setSelectedMethod,
    amountInput,
    setAmountInput,
    handleAddPayment,
    currentTotal,
}) => {
    return (
        <>
            <h3 className="text-lg font-medium mb-4">Agregar Método</h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
                {metodos.map((m) => (
                    <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                            setSelectedMethod(m.id);
                            // Logic for resetting amount if needed is handled in parent or here?
                            // Parent handles the amountInput reset if needed, or we just set method.
                        }}
                        className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${selectedMethod === m.id
                                ? 'bg-celeste text-negro border-celeste scale-105 shadow-md'
                                : 'bg-transparent border-gray-600 hover:border-celeste hover:text-celeste'
                            }`}
                    >
                        <span className="text-2xl">{m.icon}</span>
                        <span className="text-xs font-medium">{m.label}</span>
                    </button>
                ))}
            </div>

            <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">Monto</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                        type="number"
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        className="input pl-8 w-full text-lg font-bold"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={handleAddPayment}
                disabled={!selectedMethod || parseFloat(amountInput) <= 0 || currentTotal <= 0}
                className={`btn-secondary w-full mb-auto ${currentTotal <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Agregar Pago
            </button>

            <hr className="border-gray-700 my-6" />
        </>
    );
};
