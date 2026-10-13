import { Routes } from '@angular/router';
import { TareasCrearPage } from './pages/tareas/tareas-crear/tareas-crear.page';

//EAGER LOADING
export const tareasRoutes: Routes = [
  { path: 'tareas', title: 'Tarea', component: TareasCrearPage },

  //LAZY LOADING
  {
    //EN APP.ROUTES PUSIMOS QUE /TAREAS, SI PONEN /TAREAS/ALGO Y ALGO NO EXISTE SE LLAMA AL METODO DE ABAJO Y SE MUESTRA ESTA PAGINA
    path: '',
    pathMatch: 'full',
    title: 'Listar tareas',
    loadComponent: async () => {
      const module = await import('./pages/tareas/tareas-listar/tareas-listar.page');
      return module.TareasListarPage;
    },
  },
  {
    path: 'create',
    title: 'Crear tarea',
    loadComponent: () => import('./pages/tareas/tareas-crear/tareas-crear.page'),
  },
  {
  path: 'editar/:id',
  title: 'Editar tarea',
  loadComponent: () => import('./pages/tareas/tareas-editar/tareas-editar.page'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default tareasRoutes;
