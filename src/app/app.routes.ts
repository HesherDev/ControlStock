// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { PedidoComponent } from './components/pedido/pedido.component'; 
import { ProductoComponent } from './components/producto/producto.component';

export const routes: Routes = [
  { path: 'clientes', component: ClienteComponent },
  { path: 'pedidos', component: PedidoComponent }, 
  { path: 'productos', component: ProductoComponent },
  { path: '**', redirectTo: 'clientes' },
];
