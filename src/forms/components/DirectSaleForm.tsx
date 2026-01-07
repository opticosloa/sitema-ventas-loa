import React, { useState } from 'react';
import type { FormValues } from '../../types/ventasFormTypes';
import { QRScanner } from './QRScanner';

interface DirectSaleFormProps {
    formState: FormValues;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const DirectSaleForm: React.FC<DirectSaleFormProps> = ({
    formState,
    onInputChange,
}) => {
    const { cantidadItems, Observacion } = formState;
    const [showScanner, setShowScanner] = useState(false);

    const handleScanClick = () => {
        setShowScanner(true);
    };

    const handleScanSuccess = (decodedText: string) => {
        setShowScanner(false);
        // Append to Observacion
        const newObservacion = Observacion
            ? `${Observacion}\nProducto: ${decodedText}`
            : `Producto: ${decodedText}`;

        // Synthetic event to update parent state via onInputChange
        const event = {
            target: {
                name: 'Observacion',
                value: newObservacion,
                type: 'textarea'
            }
        } as React.ChangeEvent<HTMLTextAreaElement>;

        onInputChange(event);
    };

    return (
        <>
            {showScanner && (
                <QRScanner
                    onScanSuccess={handleScanSuccess}
                    onClose={() => setShowScanner(false)}
                />
            )}
            <section className="bg-opacity-10 border border-blanco rounded-xl p-4">
                <h3 className="text-blanco font-medium mb-3">Detalle de Venta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm text-blanco">Cantidad de artículos</span>
                        <input
                            type="number"
                            name="cantidadItems"
                            value={cantidadItems}
                            onChange={onInputChange}
                            className="input"
                            min="1"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={handleScanClick}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-crema text-sm hover:bg-celeste hover:opacity-85 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 -960 960 960" fill="currentColor"><path d="M80-680v-200h200v80H160v120H80Zm0 600v-200h80v120h120v80H80Zm600 0v-80h120v-120h80v200H680Zm120-600v-120H680v-80h200v200h-80ZM700-260h60v60h-60v-60Zm0-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm120-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm240-320v240H520v-240h240ZM440-440v240H200v-240h240Zm0-320v240H200v-240h240Zm-60 500v-120H260v120h120Zm0-320v-120H260v120h120Zm320 0v-120H580v120h120Z" /></svg>
                        <span className="hidden sm:inline">Escanear Producto</span>
                    </button>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm text-blanco">Observaciones</span>
                        <textarea
                            name="Observacion"
                            value={Observacion}
                            onChange={onInputChange}
                            className="input h-24"
                            placeholder="Detalle de items..."
                        />
                    </label>
                </div>
            </section>
        </>
    );
};
