import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';

//La idea de app.routes es donde llamamos a todas las rutas de nuestra web, pero la idea no es definirlas acá como hicimos con usuarios si no que deberíamos
//definirlas en rutas separadas como hicimos con tareas.

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  //EAGER LOADING (LO CARGAMOS SI O SI LO MAS RAPIDO POSIBLE)
  { path: 'home', title: 'Home', component: HomePage },

  //LAZY LOADING:
  {
    path: 'usuarios',
    title: 'Listar usuarios',
    loadComponent: async () => {
      const module = await import('./pages/usuarios/listar-usuarios/listar-usuarios.page');
      return module.ListarUsuariosPage;
    },
  },
  {
    path: 'usuarios/create',
    title: 'Crear usuario',
    loadComponent: async () => {
      const module = await import('./pages/usuarios/crear-usuario/crear-usuario.page');
      return module.CrearUsuarioPage;
    },
  },
  {
    path: 'usuarios/editar/:id',
    title: 'Editar usuario',
    loadComponent: async() => {
      const module = await import('./pages/usuarios/editar-usuario/editar-usuario.page');
      return module.EditarUsuarioPage;
    }
  }
  ,
  {
    path: 'tareas',
    loadChildren: () => import('./tareas.routes'), //SI ESTO DA ERROR HAY QUE HACER EXPORT EN TAREAS.ROUTES
  },
  {
    path: 'tareas/create',
    loadChildren: () => import('./tareas.routes'),
  },
  {
    path: '**',
    loadComponent: async () => (await import('./pages/not-found/not-found.page')).NotFoundPage,
  },
];
