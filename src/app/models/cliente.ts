// models/cliente.ts
export interface Cliente {
  ClienteId?: number; // Campo esperado por el backend
  id?: number;        // Campo utilizado por el frontend
  nombre: string;
  email: string;
  telefono: string;
  direccion?: string;
}
