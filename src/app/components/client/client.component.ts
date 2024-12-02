// client.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { YourDialogComponent } from '../modals/your-dialog.component';
import { ErrorModalComponent } from '../modals/error-modal/error-modal.component';
import { ConfirmDeleteComponent } from '../modals/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-client',
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
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  showTable: boolean = false;
  loading: boolean = false;
  searchQuery: string = '';

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
        this.clients = clients;
        this.filteredClients = clients;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error while loading clients:', error);
        this.loading = false;
      },
    });
  }

  searchClient(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.filteredClients = this.clients;
      return;
    }

    this.filteredClients = this.clients.filter(
      (client) =>
        client.ClientId.toString().includes(query) ||
        client.Name.toLowerCase().includes(query) ||
        client.Email.toLowerCase().includes(query) ||
        client.Phone.toLowerCase().includes(query) ||
        client.Address.toLowerCase().includes(query)
    );

    if (this.filteredClients.length === 0) {
      this.dialog.open(ErrorModalComponent, { width: '300px' });
    }
  }

  openModal(client: Client | null): void {
    const clientToOpen = client || {
      ClientId: null,
      Name: '',
      Email: '',
      Phone: '',
      Address: '',
    };

    const dialogRef = this.dialog.open(YourDialogComponent, {
      width: '400px',
      data: { ...clientToOpen },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadClients();
      }
    });
  }

  deleteClient(clientId: number): void {
    if (!clientId) {
      console.error('Invalid client ID. Cannot delete.');
      return;
    }
  
    // Abre el modal de confirmación
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this client?' }, // Puedes personalizar el mensaje
    });
  
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.clientService.deleteClient(clientId).subscribe({
          next: () => {
            this.loadClients(); // Recarga los clientes si la eliminación es exitosa
          },
          error: (error) => {
            console.error('Error while deleting client:', error);
          },
        });
      }
    });
  }
  
  openEditModal(client: Client): void {
    if (client && client.ClientId) {
      const dialogRef = this.dialog.open(YourDialogComponent, {
        width: '400px',
        data: { ...client },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadClients();
        }
      });
    } else {
      console.error('Invalid client to edit');
    }
  }

  toggleTableVisibility(): void {
    this.showTable = !this.showTable;
  }
}
