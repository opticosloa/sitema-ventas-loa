import axios from 'axios';

export const createMercadoPagoPreference = async (
    venta_id: string,
    monto: number
) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.post(
        '/api/payments/mercadopago/preference',
        { venta_id, monto },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return data;
};
