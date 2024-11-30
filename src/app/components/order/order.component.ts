// src/app/components/order/order.component.ts
import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderComponent } from '../modals/add-order/add-order.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router'; // Para agregar rutas, si es necesario

@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterModule], // Asegúrate de importar RouterModule si vas a usar rutas
})
export class OrderComponent {
  orders: Order[] = [];
  showTable: boolean = false;
  loading: boolean = false;

  constructor(private orderService: OrderService, private dialog: MatDialog) {
    this.loadOrders();
  }

  // Método para alternar la visibilidad de la tabla de pedidos
  toggleTableVisibility(): void {
    this.showTable = !this.showTable;
  }

  // Método para abrir el modal de agregar pedido
  openModal(): void {
    const dialogRef = this.dialog.open(AddOrderComponent, { width: '500px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadOrders();
      }
    });
  }

  // Método para abrir el modal de editar pedido
  openEditModal(order: Order): void {
    if (!order?.OrderId) {
      console.error('Invalid order for editing:', order);
      return;
    }
    const dialogRef = this.dialog.open(AddOrderComponent, {
      width: '500px',
      data: order,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadOrders();
      }
    });
  }

  // Método para cargar los pedidos desde el servicio
  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      },
    });
  }

  // Método para eliminar un pedido
 // Método para eliminar un pedido
deleteOrder(orderId: number): void {
  if (!orderId || typeof orderId !== 'number' || orderId <= 0) {
    console.error(`Invalid order ID: ${orderId}`);
    return;
  }

  this.orderService.deleteOrder(orderId).subscribe({
    next: () => {
      console.log(`Order with ID ${orderId} deleted successfully.`);
      this.loadOrders(); // Recargar las órdenes después de eliminar
    },
    error: (error) => console.error(`Error deleting order with ID ${orderId}:`, error),
  });
}

}
