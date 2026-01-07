import React from 'react';
import type { FormValues } from '../../types/ventasFormTypes';

interface DoctorFormProps {
    formState: FormValues;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSearchDoctor: () => void;
    loading: boolean;
}

export const DoctorForm: React.FC<DoctorFormProps> = ({
    formState,
    onInputChange,
    handleSearchDoctor,
    loading,
}) => {
    const { doctorMatricula, doctorNombre } = formState;

    return (
        <section className="bg-opacity-10 border border-blanco rounded-xl p-4">
            <h3 className="text-blanco font-medium mb-3">Datos del Médico</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-opacity-10 border border-blanco rounded-xl p-4">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm text-blanco">Buscar por Matrícula</span>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="doctorMatricula"
                                placeholder="Ingrese Matrícula"
                                value={doctorMatricula}
                                onChange={onInputChange}
                                className="input flex-1"
                            />
                            <button
                                type="button"
                                onClick={handleSearchDoctor}
                                className={`btn-primary px-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                disabled={loading}
                            >
                                {loading ? '...' : 'Buscar'}
                            </button>
                        </div>
                    </label>
                </div>

                <div className="bg-opacity-10 border border-blanco rounded-xl p-4">
                    <h3 className="text-blanco font-medium mb-3">Médico</h3>
                    <input
                        name="doctorNombre"
                        value={doctorNombre}
                        onChange={onInputChange}
                        placeholder="Nombre del médico"
                        className="input"
                        disabled
                    />
                </div>
            </div>
        </section>
    );
};
