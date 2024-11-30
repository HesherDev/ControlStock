  // src/app/services/pedido.service.ts
  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
  import { Order } from '../models/order';
  
  @Injectable({
    providedIn: 'root',
  })
  export class OrderService {
    private apiUrl = 'https://localhost:7143/api/Order';
  
    constructor(private http: HttpClient) {}
  
    getOrders(): Observable<Order[]> {
      return this.http.get<Order[]>(this.apiUrl).pipe(catchError(this.handleError));
    }
  
    addOrder(order: Order): Observable<Order> {
      return this.http
        .post<Order>(this.apiUrl, order, this.httpOptions())
        .pipe(catchError(this.handleError));
    }
  
    updateOrder(id: number, order: Order): Observable<void> {
      return this.http
        .put<void>(`${this.apiUrl}/${id}`, order, this.httpOptions())
        .pipe(catchError(this.handleError));
    }
  
    deleteOrder(id: number): Observable<void> {
      return this.http
        .delete<void>(`${this.apiUrl}/${id}`)
        .pipe(catchError(this.handleError));
    }
    
    private handleError(error: any): Observable<never> {
      console.error('OrderService Error:', {
        message: error.message,
        status: error.status,
        details: error.error, 
      });
    
      alert(`Error: ${error.error?.mensaje || 'Unexpected error'}`);
      return throwError(() => new Error(error.error?.mensaje || 'OrderService Error'));
    }
    
    private httpOptions() {
      return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    }
  }
  