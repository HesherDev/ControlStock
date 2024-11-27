// src/app/components/modals/agregar-producto/agregar-producto.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class AgregarProductoComponent {
  productoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AgregarProductoComponent>,
    private fb: FormBuilder,
    private productoService: ProductoService,
    @Inject(MAT_DIALOG_DATA) public data: Producto | null
  ) {
    // Inicializamos el formulario con los valores de 'data' si existen (para edición), o valores por defecto (para creación)
    this.productoForm = this.fb.group({
      nombre: [data?.nombre ?? '', [Validators.required, Validators.maxLength(100)]],
      descripcion: [data?.descripcion ?? '', [Validators.maxLength(255)]],
      precio: [data?.precio ?? 0, [Validators.required, Validators.min(0)]],
      cantidad: [data?.cantidad ?? 1, [Validators.required, Validators.min(1)]],
      categoria: [data?.categoria ?? '', [Validators.maxLength(50)]],
      codigo: [data?.codigo ?? '', [Validators.required, Validators.maxLength(50)]],
      usuarioId: [data?.usuarioId ?? 1, [Validators.required]],
      productoId: [data?.productoId ?? ''],  // Asegúrate de que esto esté presente
    });
    
  }

  // Método que se llama al guardar el formulario
  onSave(): void {
    if (this.productoForm.valid) {
      const producto = this.productoForm.value;

      // Si 'data' tiene un productoId, significa que estamos editando, de lo contrario, estamos creando un nuevo producto
      if (this.data?.productoId) {
        this.updateProducto({ ...producto, productoId: this.data.productoId });
      } else {
        this.addProducto(producto);
      }
    } else {
      console.warn('Formulario inválido', this.productoForm.errors);
    }
  }

  // Método para actualizar un producto
  updateProducto(producto: Producto): void {
    this.productoService.updateProducto(producto.productoId, producto).subscribe({
      next: () => {
        console.log('Producto actualizado con éxito:', producto);
        this.dialogRef.close(true); // Cierra el modal y notifica éxito
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
        this.dialogRef.close(false); // Cierra el modal y notifica error
      },
    });
  }
  

  // Método para agregar un producto
  addProducto(producto: Producto): void {
    this.productoService.addProducto(producto).subscribe({
      next: () => {
        console.log('Producto agregado con éxito:', producto);
        this.dialogRef.close(true); // Cierra el modal y notifica éxito
      },
      error: (error) => {
        console.error('Error al agregar producto:', error);
        this.dialogRef.close(false); // Cierra el modal y notifica error
      },
    });
  }
}