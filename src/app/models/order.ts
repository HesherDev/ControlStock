  // models/pedido.ts
// models/pedido.ts
export interface Order {
  OrderId?: number; // Hacemos 'OrderId' opcional para nuevas órdenes
  ClientId: number;
  ClientName?: string; // Nombre del cliente, opcional en caso de no tenerlo directamente
  OrderDate: string;
  Total: number;
  Status?: string; // El estado del pedido, opcional
  Client?: any; // Si 'Client' es opcional, puede contener los detalles completos del cliente
}
