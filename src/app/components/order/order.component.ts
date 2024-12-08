// src/app/components/order/order.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderComponent } from '../modals/add-order/add-order.component';
import { ErrorModalComponent } from '../modals/error-modal/error-modal.component'; // Import del modal de error
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmDeleteComponent } from '../modals/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  showTable = false;
  loading = false;
  searchQuery = '';
  searchError = ''; // Error message for invalid search

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog // Servicio para abrir modales
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.searchError = 'Failed to load orders. Please try again.';
        this.loading = false;
      },
    });
  }

  searchOrder(): void {
    this.searchError = '';

    if (!this.searchQuery.trim()) {
      this.filteredOrders = this.orders;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      order.OrderId?.toString().toLowerCase().includes(query) ||
      order.ClientId?.toString().toLowerCase().includes(query)
    );

    if (this.filteredOrders.length === 0) {
      // Abrir el modal de error cuando no se encuentran resultados
      this.dialog.open(ErrorModalComponent, {
        width: '300px',
      });
    }
  }

  openModal(order: Order | null): void {
    const orderData = order || { OrderId: null, ClientId: null, OrderDate: '', Status: '' };

    const dialogRef = this.dialog.open(AddOrderComponent, {
      width: '500px',
      data: { ...orderData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadOrders();
      }
    });
  }

  openEditModal(order: Order): void {
    if (!order?.OrderId) {
      console.error('Invalid order for editing.');
      return;
    }

    const dialogRef = this.dialog.open(AddOrderComponent, {
      width: '500px',
      data: { ...order },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadOrders();
      }
    });
  }

  deleteOrder(orderId: number): void {
    if (!orderId) {
      console.error('Invalid order ID.');
      return;
    }
  
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this order?' },
    });
  
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.orderService.deleteOrder(orderId).subscribe({
          next: () => {
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error deleting order:', error);
            this.dialog.open(ErrorModalComponent, {
              width: '300px',
              data: { message: 'Failed to delete order. Please try again.' },
            });
          },
        });
      }
    });
  }
  
  toggleTableVisibility(): void {
    this.showTable = !this.showTable;
  }
}
