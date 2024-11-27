// src/app/components/pedido/pedido.component.ts
import { Component } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido';
import { MatDialog } from '@angular/material/dialog';
import { AgregarPedidoComponent } from '../modals/agregar-pedido/agregar-pedido.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pedido',
  standalone: true,
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
  ],
})
export class PedidoComponent {
  pedidos: Pedido[] = [];
  showTable: boolean = false;

  constructor(
    private pedidoService: PedidoService,
    private dialog: MatDialog
  ) {
    this.loadPedidos();
  }

  toggleTableVisibility(): void {
    this.showTable = !this.showTable;
  }

  openModal(): void {
    const dialogRef = this.dialog.open(AgregarPedidoComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPedidos();
      }
    });
  }

  openEditModal(pedido: Pedido): void {
    const dialogRef = this.dialog.open(AgregarPedidoComponent, {
      width: '500px',
      data: pedido,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPedidos();
      }
    });
  }

  loadPedidos(): void {
    this.pedidoService.getPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
      },
    });
  }

  deletePedido(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      this.pedidoService.deletePedido(id).subscribe({
        next: () => this.loadPedidos(),
        error: (error) => console.error('Error al eliminar el pedido:', error),
      });
    }
  }
}
