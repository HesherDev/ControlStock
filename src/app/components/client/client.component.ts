// client.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';  // Asegúrate de importar esto
import { MatButtonModule } from '@angular/material/button';  // Importar si es necesario
import { RouterModule } from '@angular/router';  // Agregar importación de RouterModule
import { YourDialogComponent } from '../modals/your-dialog.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    RouterModule  // Agregar RouterModule aquí
  ],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit {
  clients: Client[] = [];
  showTable: boolean = false;
  loading: boolean = false;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: (clients: Client[]) => {
        console.log('Clientes cargados desde la API:', clients);
        this.clients = clients.map((client) => ({
          ClientId: client.ClientId ?? 0,
          Name: client.Name || 'No Name',
          Email: client.Email || 'No Email',
          Phone: client.Phone || 'No Phone',
          Address: client.Address || 'No Address',
        }));
        console.log('Clientes procesados:', this.clients);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.loading = false;
      },
    });
  }

  openModal(): void {
    const dialogRef = this.dialog.open(YourDialogComponent, {
      width: '400px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Resultado del modal (nuevo cliente):', result);
      if (result) {
        this.loadClients();
      }
    });
  }

  deleteClient(clientId: number): void {
    console.log('ID del cliente a eliminar:', clientId);
    if (!clientId) {
      console.error('El ID del cliente es inválido, no se puede eliminar.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clientService.deleteClient(clientId).subscribe({
        next: () => {
          console.log('Cliente eliminado correctamente:', clientId);
          this.loadClients();
        },
        error: (error) => {
          console.error('Error al eliminar cliente:', error);
        },
      });
    }
  }

  openEditModal(client: Client): void {
    console.log('Cliente a editar:', client);
    if (client && client.ClientId) {
      const dialogRef = this.dialog.open(YourDialogComponent, {
        width: '400px',
        data: { ...client },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log('Resultado del modal (editar cliente):', result);
        if (result) {
          this.loadClients();
        }
      });
    } else {
      console.error('Cliente no válido para editar');
    }
  }

  toggleTableVisibility(): void {
    this.showTable = !this.showTable;
    console.log('Visibilidad de la tabla:', this.showTable);
  }
}
