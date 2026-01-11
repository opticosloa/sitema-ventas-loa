import React, { useState } from 'react';
import LOAApi from '../api/LOAApi';

interface CrystalForm {
    material: string;
    tratamiento: string;
    esfera: number;
    cilindro: number;
    stock: number;
    stock_minimo: number;
    ubicacion: string;
    precio_venta: number;
    precio_costo: number;
}

const initialForm: CrystalForm = {
    material: '',
    tratamiento: '',
    esfera: 0,
    cilindro: 0,
    stock: 0,
    stock_minimo: 5,
    ubicacion: '',
    precio_venta: 0,
    precio_costo: 0,
};

export const FormularioCristal: React.FC = () => {
    const [form, setForm] = useState<CrystalForm>(initialForm);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'material' || name === 'tratamiento' || name === 'ubicacion'
                ? value
                : parseFloat(value) || 0,
        }));
    };

    // Función principal de guardado
    const saveCrystal = async (currentData: CrystalForm) => {
        setLoading(true);
        try {
            await LOAApi.post('/api/crystals', currentData);
            return true;
        } catch (error) {
            console.error(error);
            alert('Error al crear cristal');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await saveCrystal(form);
        if (success) {
            alert('Cristal creado correctamente');
            setForm(initialForm);
        }
    };

    // Función para guardar e incrementar un valor específico
    const handleSaveAndIncrement = async (field: 'esfera' | 'cilindro') => {
        const success = await saveCrystal(form);
        if (success) {
            setForm(prev => ({
                ...prev,
                [field]: Number((prev[field] + 0.25).toFixed(2))
            }));
            // Feedback visual opcional: podrías usar un toast aquí
        }
    };

    const inputClass = "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all";

    return (
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 fade-in text-white">
            <div className="flex items-center justify-between gap-3 mb-6">
                <h2 className="text-2xl font-semibold">Alta de Cristal (Stock)</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* SECCIÓN: DATOS GENERALES */}
                <section className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Material</label>
                            <select
                                required
                                name="material"
                                value={form.material}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="" className="bg-slate-900">Seleccionar...</option>
                                <option value="Organico" className="bg-slate-900">Orgánico</option>
                                <option value="Policarbonato" className="bg-slate-900">Policarbonato</option>
                                <option value="Mineral" className="bg-slate-900">Mineral</option>
                                <option value="Alto Indice" className="bg-slate-900">Alto Índice</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Tratamiento / Color</label>
                            <input
                                required
                                name="tratamiento"
                                value={form.tratamiento}
                                onChange={handleChange}
                                placeholder="Ej: Blanco"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2 font-bold text-cyan-400">Esfera</label>
                            <input
                                type="number" step="0.25"
                                name="esfera"
                                value={form.esfera}
                                onChange={handleChange}
                                className={`${inputClass} border-cyan-500/30 text-lg`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2 font-bold text-cyan-400">Cilindro</label>
                            <input
                                type="number" step="0.25"
                                name="cilindro"
                                value={form.cilindro}
                                onChange={handleChange}
                                className={`${inputClass} border-cyan-500/30 text-lg`}
                            />
                        </div>
                    </div>
                </section>

                {/* SECCIÓN: STOCK Y PRECIOS */}
                <section className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Stock Inicial</label>
                            <input type="number" name="stock" value={form.stock} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Mínimo</label>
                            <input type="number" name="stock_minimo" value={form.stock_minimo} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Precio Costo</label>
                            <input type="number" name="precio_costo" value={form.precio_costo} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Precio Venta</label>
                            <input type="number" name="precio_venta" value={form.precio_venta} onChange={handleChange} className={`${inputClass} border-green-500/30`} />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm text-gray-400 mb-2">Ubicación</label>
                            <input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Cajón..." className={inputClass} />
                        </div>
                    </div>
                </section>

                {/* ACCIONES */}
                <div className="flex flex-wrap gap-3 justify-end items-center mt-2">

                    <button
                        type="button"
                        onClick={() => handleSaveAndIncrement('cilindro')}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-lg active:scale-95"
                    >
                        💾 Guardar y +0.25 Cilindro
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSaveAndIncrement('esfera')}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-lg active:scale-95"
                    >
                        💾 Guardar y +0.25 Esfera
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-8 rounded-lg transition-all shadow-lg shadow-cyan-900/20 active:scale-95 min-w-[150px]"
                    >
                        {loading ? 'Cargando...' : 'Finalizar Carga'}
                    </button>
                    <div className="h-10 w-px bg-white/20 mx-2 hidden sm:block"></div>


                </div>
            </form>
        </div>
    );
};