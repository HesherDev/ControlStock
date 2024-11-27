// src/app/models/producto.ts
export interface Producto {
  productoId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  categoria: string;
  codigo: string;
  usuarioId: number;
}
