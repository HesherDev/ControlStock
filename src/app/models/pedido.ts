// models/pedido.ts
export interface Pedido {
  PedidoId: number;
  ClienteId: number;
  FechaPedido: Date;
  Total: number;
  ClienteNombre?: string; // Opcional
}
