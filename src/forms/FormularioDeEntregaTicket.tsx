import React from 'react';
// import LOAApi from '../api/LOAApi';



export const FormularioDeEntregaTicket: React.FC = () => {
    // const { formState, onInputChange, onResetForm, setFormState } = useForm(initialForm);

    const onSubmit = async () => {
        try {
            // const response = await LOAApi.post(`/api/tickets/${id}/entregar`);
        } catch (error) {
            console.error('Error al entragar producto', error);
        }
    }
    return (
        <div>
            <h2>Formulario de entrega de ticket</h2>
            <button
                onClick={onSubmit}
            >Entregar</button>
        </div>
    )
}