import React, { useEffect, useState } from 'react';
import { useUiStore, useAppSelector } from '../../hooks';
import LOAApi from '../../api/LOAApi';
import type { Ticket } from '../../types/Ticket';

// Extended interface to match the JOINed data returned by sp_ticket_get
// Note: This duplicates some logic from TicketList but adapts to the new "Taller" requirements
interface TicketListItem extends Ticket {
    cliente: string;
    producto: string;
    empleado: string;
    fecha: string; // Alias for fecha_entrada or computed
    sucursal_id: string; // To filter by user's sucursal
}

const statusClasses = (estado: string) => {
    switch (estado) {
        case "PENDIENTE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "EN_TALLER": return "bg-blue-100 text-blue-800 border-blue-200";
        case "LISTO": return "bg-green-100 text-green-800 border-green-200";
        case "ENTREGADO": return "bg-gray-100 text-gray-800 border-gray-200";
        case "CANCELADO": return "bg-red-100 text-red-800 border-red-200";
        default: return "bg-gray-50 text-gray-800";
    }
};

const formatDate = (iso: string) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export const ListaTicketsTaller: React.FC = () => {
    const { handlerTicketDetail } = useUiStore();
    const { sucursal_id } = useAppSelector(state => state.auth);
    const [tickets, setTickets] = useState<TicketListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            if (!sucursal_id) return;
            setIsLoading(true);
            try {
                // Fetch tickets filtered by sucursal
                // As per controller: req.query -> sucursal_id (required)
                // We can pass 'estado' if we want to filter active ones only, but for now we list all
                const { data } = await LOAApi.get<{ success: boolean; result: TicketListItem[] }>(`/api/tickets`, {
                    params: { sucursal_id }
                });

                if (data.success && Array.isArray(data.result)) {
                    setTickets(data.result);
                }
            } catch (error) {
                console.error("Error fetching tickets:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTickets();
    }, [sucursal_id]);

    if (isLoading) {
        return <div className="text-white text-center text-xl mt-10 animate-pulse">Cargando tickets...</div>;
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white drop-shadow-md">Cola de Trabajo</h2>
                <span className="text-white/80 text-sm bg-white/10 px-3 py-1 rounded-full border border-white/20">
                    {tickets.length} Tickets
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.map((ticket) => (
                    <article
                        key={ticket.ticket_id || ticket.venta_id}
                        onClick={() => handlerTicketDetail(ticket)} // Opens the modal
                        className="
                group cursor-pointer
                bg-white/80 backdrop-blur-sm 
                border-2 border-transparent hover:border-white/80
                rounded-xl shadow-lg 
                p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:bg-white
            "
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase tracking-wider ${statusClasses(ticket.estado)}`}>
                                {ticket.estado}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                                #{ticket.venta_id?.substring(0, 8)}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-1">{ticket.cliente}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">{ticket.producto}</p>

                        <div className="flex justify-between items-end border-t pt-3 border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-gray-400 font-semibold">Ingreso</span>
                                <span className="text-sm font-medium text-slate-700">{formatDate(ticket.fecha)}</span>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-[10px] uppercase text-gray-400 font-semibold">Vendedor</span>
                                <span className="text-xs font-medium text-slate-700">{ticket.empleado.split(' ')[0]}</span>
                            </div>
                        </div>

                    </article>
                ))}

                {tickets.length === 0 && (
                    <div className="col-span-full py-20 text-center text-white/60">
                        <p className="text-xl">No hay tickets pendientes en esta sucursal.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
