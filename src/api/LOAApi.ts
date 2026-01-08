import axios from 'axios';

const LOAApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true' // Esto salta la página de aviso de ngrok automáticamente
    },
    withCredentials: true
});

export default LOAApi;