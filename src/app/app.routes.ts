import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { adminGuard, gestorGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'planos',
    loadComponent: () => import('./pages/planos/planos').then(m => m.PlanosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'pagamento',
    canActivate: [authGuard],
    children: [
      {
        path: 'sucesso',
        loadComponent: () => import('./pages/pagamento/sucesso').then(m => m.PagamentoSucessoComponent)
      },
      {
        path: 'cancelado',
        loadComponent: () => import('./pages/pagamento/cancelado').then(m => m.PagamentoCanceladoComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.DashboardComponent),
        canActivate: [gestorGuard]
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/admin/usuarios/usuarios-list').then(m => m.UsuariosListComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'alimentos',
        loadComponent: () => import('./pages/admin/alimentos/alimentos-list').then(m => m.AlimentosListComponent),
        canActivate: [gestorGuard]
      },
      {
        path: 'equivalencias',
        loadComponent: () => import('./pages/admin/equivalencias/equivalencias-list').then(m => m.EquivalenciasListComponent),
        canActivate: [gestorGuard]
      }
    ]
  }
];
