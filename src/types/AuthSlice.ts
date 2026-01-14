

export interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated';
    uid: string | null;
    email: string | null;
    nombre: string | null;
    apellido: string | null;
    sucursal_id: string | null;
    sucursal_name: string | null;
    errorMessage: string | null;
    role: string | null;
    max_descuento?: number;
}