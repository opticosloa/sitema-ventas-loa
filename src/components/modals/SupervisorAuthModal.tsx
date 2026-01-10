import React, { useState, useEffect } from 'react';
import LOAApi from '../../api/LOAApi';

interface SupervisorAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (supervisorName: string) => void;
    actionName: string;
}

interface AdminUser {
    id: string;
    nombre: string;
    apellido: string;
}

export const SupervisorAuthModal: React.FC<SupervisorAuthModalProps> = ({ isOpen, onClose, onSuccess, actionName }) => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [selectedAdmin, setSelectedAdmin] = useState<string>('');
    const [pin, setPin] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadAdmins();
            setPin('');
            setError('');
            setSelectedAdmin('');
        }
    }, [isOpen]);

    const loadAdmins = async () => {
        try {
            const { data } = await LOAApi.get('/api/users/admins');
            if (data.success) {
                setAdmins(data.result);
            }
        } catch (error) {
            console.error("Error loading admins:", error);
            setError("Error cargando lista de supervisores");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAdmin || !pin) {
            setError("Seleccione un supervisor e ingrese el PIN");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data } = await LOAApi.post('/api/users/verify-supervisor', {
                admin_id: selectedAdmin,
                pin: pin
            });

            if (data.success) {
                onSuccess(data.supervisor_name);
                onClose();
            } else {
                setError("Autorización fallida");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || "Error de autorización");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 w-96 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4 text-center">
                    🔑 Autorización Requerida
                </h2>
                <p className="text-gray-400 text-sm text-center mb-6">
                    {actionName} requiere aprobación de un Supervisor.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-xs mb-1">Autorizado por:</label>
                        <select
                            className="input w-full bg-gray-700 border-gray-600 focus:border-celeste"
                            value={selectedAdmin}
                            onChange={(e) => setSelectedAdmin(e.target.value)}
                        >
                            <option value="">Seleccionar Supervisor...</option>
                            {admins.map(admin => (
                                <option key={admin.id} value={admin.id}>
                                    {admin.nombre} {admin.apellido}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs mb-1">PIN de Seguridad:</label>
                        <input
                            type="password"
                            className="input w-full bg-gray-700 border-gray-600 text-center tracking-widest font-bold"
                            placeholder="****"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            maxLength={8}
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-xs text-center bg-red-900/20 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-danger flex-1"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                            disabled={loading || !selectedAdmin || !pin}
                        >
                            {loading ? "Verificando..." : "Autorizar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
