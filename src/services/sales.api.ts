import axios from 'axios';

export const getEstadoPagoVenta = async (ventaId: string) => {
    const { data } = await axios.get(
        `/api/sales/${ventaId}/estado-pago`
    );

    return data;
};
