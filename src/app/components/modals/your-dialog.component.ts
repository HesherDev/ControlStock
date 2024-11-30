// src/app/components/modals/your-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-your-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './your-dialog.component.html',
  styleUrls: ['./your-dialog.component.css'],
})
export class YourDialogComponent {
  clientForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<YourDialogComponent>,
    private fb: FormBuilder,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: Client
  ) {
    this.clientForm = this.fb.group({
      Name: [data?.Name || '', Validators.required],
      Email: [data?.Email || '', [Validators.required, Validators.email]],
      Phone: [data?.Phone || '', Validators.required],
      Address: [data?.Address || ''],
    });
  }

  onSave(): void {
    if (this.clientForm.valid) {
      const client = this.clientForm.value;

      if (this.data?.ClientId) {
        const updatedClient: Client = {
          ...client,
          ClientId: this.data.ClientId,
        };
        console.log('Actualizando cliente:', updatedClient);

        this.clientService.updateClient(updatedClient.ClientId, updatedClient).subscribe({
          next: () => {
            console.log('Cliente actualizado correctamente');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error al actualizar cliente:', error);
          },
        });
      } else {
        console.log('Creando nuevo cliente:', client);

        this.clientService.addClient(client).subscribe({
          next: () => {
            console.log('Cliente agregado correctamente');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error al agregar cliente:', error);
          },
        });
      }
    }
  }
}
