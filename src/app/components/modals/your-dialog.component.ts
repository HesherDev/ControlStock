// src/app/components/modals/your-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-your-dialog',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,],
  templateUrl: './your-dialog.component.html',
  styleUrls: ['./your-dialog.component.css'],
})
export class YourDialogComponent {
  clienteForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<YourDialogComponent>,
    private fb: FormBuilder,
    private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: Cliente
  ) {
    this.clienteForm = this.fb.group({
      nombre: [data?.nombre || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      telefono: [data?.telefono || '', Validators.required],
      direccion: [data?.direccion || ''],
    });
  }

  onSave(): void {
    if (this.clienteForm.valid) {
      const cliente = this.clienteForm.value;
  
      if (this.data?.id || this.data?.ClienteId) { 
        // Editar cliente
        const clienteActualizado = { 
          ...cliente, 
          ClienteId: this.data.ClienteId || this.data.id // Ajustar el identificador
        };
  
        console.log('Datos enviados al actualizar:', clienteActualizado);
  
        this.clienteService.updateCliente(clienteActualizado.ClienteId, clienteActualizado).subscribe({
          next: () => {
            console.log('Cliente actualizado correctamente');
            this.dialogRef.close(true); // Cierra el modal y notifica éxito
          },
          error: (error) => {
            console.error('Error al actualizar cliente:', error);
          },
        });
      } else { 
        // Crear cliente
        console.log('Datos enviados al agregar:', cliente);
        this.clienteService.addCliente(cliente).subscribe({
          next: () => {
            console.log('Cliente agregado correctamente');
            this.dialogRef.close(true); // Cierra el modal y notifica éxito
          },
          error: (error) => {
            console.error('Error al agregar cliente:', error);
          },
        });
      }
    }
  } 
}
