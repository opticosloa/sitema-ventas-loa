import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Edit2, Check, X, Trash2 } from 'lucide-react';
import {
    getMaterials,
    getTreatments,
    createMaterial,
    createTreatment,
    updateMaterial,
    updateTreatment,
    type CrystalMaterial,
    type CrystalTreatment
} from '../../services/crystals.api';
import Swal from 'sweetalert2';

export const CrystalSettingsSection: React.FC = () => {
    const [materials, setMaterials] = useState<CrystalMaterial[]>([]);
    const [treatments, setTreatments] = useState<CrystalTreatment[]>([]);

    // Estados para edición inline
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempName, setTempName] = useState('');

    const [newMaterial, setNewMaterial] = useState('');
    const [newTreatment, setNewTreatment] = useState('');
    const [loading, setLoading] = useState(false);
    const [creatingMat, setCreatingMat] = useState(false);
    const [creatingTreat, setCreatingTreat] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [mats, treats] = await Promise.all([getMaterials(), getTreatments()]);
            // Solo mostramos los que están activos en esta sección
            setMaterials(mats.filter(m => m.is_active));
            setTreatments(treats.filter(t => t.is_active));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleAddMaterial = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMaterial.trim()) return;
        setCreatingMat(true);
        try {
            const added = await createMaterial(newMaterial);
            setMaterials([...materials, added]);
            setNewMaterial('');
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear el material', 'error');
        } finally { setCreatingMat(false); }
    };

    const handleAddTreatment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTreatment.trim()) return;
        setCreatingTreat(true);
        try {
            const added = await createTreatment(newTreatment);
            setTreatments([...treatments, added]);
            setNewTreatment('');
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear el tratamiento', 'error');
        } finally { setCreatingTreat(false); }
    };

    const handleUpdate = async (type: 'mat' | 'treat', id: string, name: string) => {
        if (!name.trim()) return;
        try {
            if (type === 'mat') {
                const updated = await updateMaterial(id, { nombre: name, is_active: true });
                setMaterials(materials.map(m => m.material_id === id ? updated : m));
            } else if (type === 'treat') {
                const updated = await updateTreatment(id, { nombre: name, is_active: true });
                setTreatments(treatments.map(t => t.tratamiento_id === id ? updated : t));
            }
            setEditingId(null);
            Swal.fire('Actualizado', '', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar', 'error');
        }
    };

    const handleDeactivate = async (type: 'mat' | 'treat', id: string) => {
        const confirm = await Swal.fire({
            title: '¿Desactivar elemento?',
            text: "Ya no aparecerá en el formulario de carga de stock.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                if (type === 'mat') {
                    await updateMaterial(id, { is_active: false });
                    setMaterials(materials.filter(m => m.material_id !== id));
                } else if (type === 'treat') {
                    await updateTreatment(id, { is_active: false });
                    setTreatments(treatments.filter(t => t.tratamiento_id !== id));
                }
                Swal.fire('Desactivado', '', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo desactivar', 'error');
            }
        }
    };

    const inputClass = "flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none";

    return (
        <div className="mt-8 pt-8 border-t border-slate-700">
            <header className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">Configuración de Cristales</h2>
                <p className="text-slate-400 mt-2">Gestiona los materiales y tratamientos disponibles.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SECCIÓN MATERIALES */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
                    <h3 className="text-xl font-semibold text-white mb-4">Materiales</h3>
                    <ul className="mb-4 max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {loading ? <Loader2 className="animate-spin text-cyan-500" /> :
                            materials.map(m => (
                                <li key={m.material_id} className="bg-slate-900/50 p-2 rounded border border-slate-700/50 flex items-center justify-between group">
                                    {editingId === m.material_id ? (
                                        <div className="flex items-center gap-2 w-full">
                                            <input
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                                className="bg-slate-800 border border-cyan-500 rounded px-2 py-1 text-sm text-white w-full outline-none"
                                                autoFocus
                                            />
                                            <button onClick={() => handleUpdate('mat', m.material_id, tempName)} className="text-green-500 hover:text-green-400"><Check size={16} /></button>
                                            <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-400"><X size={16} /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-slate-200 text-sm">{m.nombre}</span>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingId(m.material_id); setTempName(m.nombre); }}
                                                    className="text-slate-400 hover:text-cyan-400"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeactivate('mat', m.material_id)}
                                                    className="text-slate-400 hover:text-red-400"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))
                        }
                    </ul>
                    <form onSubmit={handleAddMaterial} className="flex gap-2">
                        <input
                            value={newMaterial}
                            onChange={e => setNewMaterial(e.target.value)}
                            placeholder="Nuevo material..."
                            className={inputClass}
                        />
                        <button type="submit" disabled={creatingMat || !newMaterial} className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg disabled:opacity-50">
                            {creatingMat ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                        </button>
                    </form>
                </div>

                {/* SECCIÓN TRATAMIENTOS */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
                    <h3 className="text-xl font-semibold text-white mb-4">Tratamientos</h3>
                    <ul className="mb-4 max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {loading ? <Loader2 className="animate-spin text-cyan-500" /> :
                            treatments.map(t => (
                                <li key={t.tratamiento_id} className="bg-slate-900/50 p-2 rounded border border-slate-700/50 flex items-center justify-between group">
                                    {editingId === t.tratamiento_id ? (
                                        <div className="flex items-center gap-2 w-full">
                                            <input
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                                className="bg-slate-800 border border-cyan-500 rounded px-2 py-1 text-sm text-white w-full outline-none"
                                                autoFocus
                                            />
                                            <button onClick={() => handleUpdate('treat', t.tratamiento_id, tempName)} className="text-green-500 hover:text-green-400"><Check size={16} /></button>
                                            <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-400"><X size={16} /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-slate-200 text-sm">{t.nombre}</span>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingId(t.tratamiento_id); setTempName(t.nombre); }}
                                                    className="text-slate-400 hover:text-cyan-400"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeactivate('treat', t.tratamiento_id)}
                                                    className="text-slate-400 hover:text-red-400"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))
                        }
                    </ul>
                    <form onSubmit={handleAddTreatment} className="flex gap-2">
                        <input
                            value={newTreatment}
                            onChange={e => setNewTreatment(e.target.value)}
                            placeholder="Nuevo tratamiento..."
                            className={inputClass}
                        />
                        <button type="submit" disabled={creatingTreat || !newTreatment} className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg disabled:opacity-50">
                            {creatingTreat ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};