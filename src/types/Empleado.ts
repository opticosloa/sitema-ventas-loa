
export interface Empleado {
  empleado_id: number;
  nombre: string;
  apellido: string;
  cuit: number;
  rol: string; 
  telefono: number | string;
  last_conect: string;
  direccion: string;
  fecha_nacimiento: string;
  cuenta_corriente: number;
}