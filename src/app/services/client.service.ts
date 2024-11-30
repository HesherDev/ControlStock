//app/components/services/client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'https://localhost:7143/api/Client';

  constructor(private http: HttpClient) {}

  // Obtener todos los clientes
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener clientes:', error);
        return throwError(() => new Error('Error al obtener clientes'));
      })
    );
  }
  
  // Agregar un cliente
  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client).pipe(
      catchError((error) => {
        console.error('Error al agregar cliente:', error);
        return throwError(() => new Error('Error al agregar cliente'));
      })
    );
  }

  // Actualizar un cliente
  updateClient(id: number, client: Client): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, client).pipe(
      catchError((error) => {
        console.error('Error al actualizar cliente:', error);
        return throwError(() => new Error('Error al actualizar cliente'));
      })
    );
  }

  // Eliminar un cliente
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar cliente:', error);
        return throwError(() => new Error('Error al eliminar cliente'));
      })
    );
  }
}
