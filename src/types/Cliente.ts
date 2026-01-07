
export interface Cliente {
  cliente_id: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  dni?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  cuenta_corriente?: number;
  created_at?: string;
  updated_at?: string;
}
