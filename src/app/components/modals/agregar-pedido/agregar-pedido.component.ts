// src/app/components/modals/agregar-pedido/agregar-pedido.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PedidoService } from '../../../services/pedido.service';
import { Pedido } from '../../../models/pedido';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-agregar-pedido',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './agregar-pedido.component.html',
  styleUrls: ['./agregar-pedido.component.css'],
})
export class AgregarPedidoComponent {
  pedidoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AgregarPedidoComponent>,
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    @Inject(MAT_DIALOG_DATA) public data: Pedido
  ) {
    this.pedidoForm = this.fb.group({
      clienteId: [data?.ClienteId || null, [Validators.required, Validators.min(1)]], // Asegurar ID válido
      fechaPedido: [data?.FechaPedido || null, Validators.required],
      total: [data?.Total || null, [Validators.required, Validators.min(0)]],
    });
  }

  onSave(): void {
    if (this.pedidoForm.valid) {
      const pedido = this.pedidoForm.value;
      if (this.data?.PedidoId) {
        this.updatePedido(pedido);
      } else {
        this.addPedido(pedido);
      }
    } else {
      console.warn('Formulario inválido', this.pedidoForm);
    }
  }
  
  updatePedido(pedido: Pedido): void {
    // Asegúrate de incluir el ID del pedido
    const updatedPedido = { ...pedido, PedidoId: this.data.PedidoId };
  
    this.pedidoService.updatePedido(this.data.PedidoId, updatedPedido).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error) => console.error('Error al actualizar pedido:', error),
    });
  }
  

  addPedido(pedido: Pedido): void {
    this.pedidoService.addPedido(pedido).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error) => console.error('Error al agregar pedido:', error),
    });
  }
}
