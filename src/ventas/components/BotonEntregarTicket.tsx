import { useState } from "react";
import LOAApi from "../../api/LOAApi";
import { useNavigate } from "react-router-dom";

interface Props {
    ticketId: string;
    estado: 'PENDIENTE' | 'LISTO' | 'ENTREGADO' | 'PAGADA';
}

export const BotonEntregarTicket = ({ ticketId, estado }: Props) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    loading;
    if (estado !== 'LISTO' && estado !== 'PAGADA') return null;

    const entregar = async () => {
        if (!confirm('¿Confirmar entrega del ticket?')) return;

        setLoading(true);
        try {
            await LOAApi.post(`/api/ventas/${ticketId}/entregar`);
            window.location.reload(); // o refetch
            alert('Ticket entregado correctamente');
            navigate('/ventas');
        } catch (e) {
            alert('Error al entregar el ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={entregar}
            className="btn-primary"
        >
            Entregar / Finalizar ticket
        </button>

    );
};
