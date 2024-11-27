// src/app/services/producto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; // Importa map
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'https://localhost:7143/api/Producto';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl).pipe(
      map((productos: any[]) =>
        productos.map((p) => ({
          ...p,
          productoId: p.productoId || p.id || p.ProductoId, // Revisar diferentes nombres posibles
        }))
      ),
      catchError((error) => throwError(() => new Error('Error al obtener productos')))
    );
  }
  
  addProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto).pipe(
      catchError((error) => throwError(() => new Error('Error al agregar producto')))
    );
  }

  updateProducto(id: number, producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto).pipe(
      catchError((error) => throwError(() => new Error('Error al actualizar producto')))
    );
  }

  deleteProducto(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log('URL de eliminación:', url); // Debe mostrar algo como https://localhost:7143/api/Producto/1
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Error al eliminar producto:', error);
        throw new Error('Error al eliminar producto');
      })
    );
  }
}
