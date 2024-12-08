// models/order.ts
export interface Order {
  OrderId?: number; 
  ClientId: number; 
  ClientName?: string; // Nombre del cliente (agregado para la vista)
  OrderDate: string; 
  Total: number; 
  Client?: { 
    Name: string; // Nombre del cliente recibido del backend
  }; 
}
