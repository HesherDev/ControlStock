import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { AgregarProductoComponent } from '../modals/agregar-producto/agregar-producto.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto',
  standalone: true,
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
})
export class ProductoComponent {
  productos: Producto[] = [];
  showTable: boolean = false;

  constructor(
    private productoService: ProductoService,
    private dialog: MatDialog
  ) {
    this.loadProductos();
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        console.log('Productos cargados:', this.productos);  // Depuración
      },
      error: (error) => console.error('Error al cargar productos:', error),
    });
  }

  openModal(producto?: Producto): void {
    console.log('Producto seleccionado para edición:', producto);
    const dialogRef = this.dialog.open(AgregarProductoComponent, {
      width: '400px',
      data: producto || null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadProductos();
    });
  }

  deleteProducto(id: number): void {
    console.log('ID recibido para eliminación:', id);  // Depuración
    if (!id) {
      console.error('El ID del producto es undefined. No se puede eliminar.');
      return;
    }

    // Si el ID está correcto, proceder con la eliminación
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe({
        next: () => this.loadProductos(),
        error: (error) => console.error('Error al eliminar producto:', error),
      });
    }
  }

  toggleTableVisibility(): void {
    this.showTable = !this.showTable;
  }
}
