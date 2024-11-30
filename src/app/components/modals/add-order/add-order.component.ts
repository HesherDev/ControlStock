// src/app/components/modals/add-order/add-order.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css'],
})
export class AddOrderComponent {
  orderForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddOrderComponent>,
    private fb: FormBuilder,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: Order | null
  ) {
    this.orderForm = this.fb.group({
      OrderId: [data?.OrderId || null], // Inicializa con null si no hay datos
      ClientId: [data?.ClientId || null, [Validators.required, Validators.min(1)]],
      OrderDate: [data?.OrderDate || null, Validators.required],
      Total: [data?.Total || null, [Validators.required, Validators.min(0)]],
    });
  }

  onSave(): void {
    if (this.orderForm.valid) {
      const order: Order = this.orderForm.value;

      if (this.data?.OrderId) {
        this.updateOrder(order);
      } else {
        this.addOrder(order);
      }
    } else {
      console.warn('Invalid form data:', this.orderForm.value);
    }
  }

  private updateOrder(order: Order): void {
    const orderId = this.data?.OrderId;

    if (!orderId) {
      console.error('Order ID is missing or invalid for update operation.');
      return;
    }

    const updatedOrder: Order = { ...order, OrderId: orderId };

    this.orderService.updateOrder(orderId, updatedOrder).subscribe({
      next: () => {
        console.log('Order updated successfully:', updatedOrder);
        this.dialogRef.close(true);
      },
      error: (error) => console.error('Error updating order:', error),
    });
  }

  private addOrder(order: Order): void {
    // Eliminar OrderId si está presente
    const { OrderId, ...orderToSend } = order; // Desestructuración para quitar OrderId
    console.log('Adding Order:', orderToSend);  // Verifica los datos aquí
    
    this.orderService.addOrder(orderToSend).subscribe({
      next: () => {
        console.log('Order added successfully:', orderToSend);
        this.dialogRef.close(true);
      },
      error: (error) => console.error('Error adding order:', error),
    });
  }
  
}
