  // models/pedido.ts
  export interface Order {
    OrderId?: number; // Hacemos 'OrderId' opcional para nuevas órdenes
    ClientId: number;
    OrderDate: string;
    Total: number;
    Client?: any; // Si 'Client' es opcional
  }
  