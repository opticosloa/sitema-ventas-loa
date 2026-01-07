import axios from 'axios';

const LOAApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
    withCredentials: true
});

export default LOAApi;