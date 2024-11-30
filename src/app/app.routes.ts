// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ClientComponent } from './components/client/client.component';
import { OrderComponent } from './components/order/order.component';
import { ProductoComponent } from './components/producto/producto.component';

export const routes: Routes = [
  { path: 'clients', component: ClientComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'products', component: ProductoComponent },
  { path: '**', redirectTo: 'clients' },
];
