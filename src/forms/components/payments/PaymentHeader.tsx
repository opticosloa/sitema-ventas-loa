import React from 'react';

interface PaymentHeaderProps {
    dniSearch: string;
    setDniSearch: (val: string) => void;
    handleSearchDni: () => void;
    ventaId: string | number | null;
    handleCancelSale: () => void;
}

export const PaymentHeader: React.FC<PaymentHeaderProps> = ({
    dniSearch,
    setDniSearch,
    handleSearchDni,
    ventaId,
    handleCancelSale,
}) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-semibold">Finalizar Pago</h2>
            <div className="flex gap-2">
                <div className="flex gap-1">
                    <input
                        className="input py-1 px-2 w-32"
                        placeholder="Buscar DNI"
                        value={dniSearch}
                        onChange={(e) => setDniSearch(e.target.value)}
                    />
                    <button type="button" onClick={handleSearchDni} className="btn-secondary text-xs px-2">
                        Buscar
                    </button>
                </div>
                {ventaId && (
                    <button
                        type="button"
                        onClick={handleCancelSale}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 ml-2"
                    >
                        Cancelar Venta
                    </button>
                )}
            </div>
        </div>
    );
};
