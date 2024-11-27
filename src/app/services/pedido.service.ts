// src/app/services/pedido.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pedido } from '../models/pedido';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  // Asegúrate de usar https si tu backend está configurado para ello
  private apiUrl = 'https://localhost:7143/api/Pedido';

  constructor(private http: HttpClient) {}

  // Obtiene la lista de pedidos
  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Agrega un nuevo pedido
  addPedido(pedido: Pedido): Observable<Pedido> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<Pedido>(this.apiUrl, pedido, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Actualiza un pedido existente
  updatePedido(id: number, pedido: Pedido): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  
    // Asegúrate de incluir el ID en el cuerpo del pedido (si el backend lo espera)
    return this.http.put<void>(`${this.apiUrl}/${id}`, { ...pedido, PedidoId: id }, httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  

  // Elimina un pedido por ID
  deletePedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores para centralizar la lógica
  private handleError(error: any): Observable<never> {
    console.error('Error en PedidoService:', error);
    return throwError(() => new Error('Error en el servicio Pedido'));
  }
}
