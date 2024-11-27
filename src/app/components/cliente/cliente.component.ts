// cliente.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente';
import { CommonModule } from '@angular/common';
import { YourDialogComponent } from '../modals/your-dialog.component';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent {
  clientes: Cliente[] = []; // Almacena la lista de clientes
  showTable: boolean = false; // Controla la visibilidad de la tabla

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog
  ) {
    this.loadClientes(); // Carga inicial de clientes
  }

  /**
   * Carga la lista de clientes desde el servicio
   */
  loadClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      },
    });
  }

  /**
   * Abre el modal para agregar un nuevo cliente
   */
  openModal(): void {
    const dialogRef = this.dialog.open(YourDialogComponent, {
      width: '400px',
      data: null, // No pasamos datos, ya que es para agregar un nuevo cliente
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadClientes(); // Recargar lista si se agrega un cliente
      }
    });
  }

  /**
   * Abre el modal para editar un cliente existente
   * @param cliente Cliente a editar
   */
  openEditModal(cliente: Cliente): void {
    const dialogRef = this.dialog.open(YourDialogComponent, {
      width: '400px',
      data: cliente, // Pasamos los datos del cliente al modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadClientes(); // Recargar lista si se actualiza un cliente
      }
    });
  }

  /**
   * Elimina un cliente por su ID
   * @param id ID del cliente a eliminar
   */
  deleteCliente(id?: number): void {
    if (!id) {
      console.error('El ID del cliente es undefined o null, no se puede eliminar.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => {
          console.log(`Cliente con ID ${id} eliminado exitosamente.`);
          this.loadClientes(); // Recargar lista después de eliminar
        },
        error: (error) => {
          console.error('Error al eliminar el cliente:', error);
        },
      });
    }
  }

  /**
   * Alterna la visibilidad de la tabla de clientes
   */
  toggleTableVisibility(): void {
    this.showTable = !this.showTable;
    console.log('Estado de showTable:', this.showTable); // Debug para confirmar el estado
  }
}
