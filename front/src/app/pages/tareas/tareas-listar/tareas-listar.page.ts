import { Component, inject, resource } from '@angular/core';
import { Tarea } from '../../model/tarea';
import { Router } from '@angular/router';
import { TareasService } from '../../../services/tareas.service';

@Component({
  imports: [],
  selector: 'app-tareas-listar',
  styleUrl: './tareas-listar.page.css',
  templateUrl: './tareas-listar.page.html',
})
export class TareasListarPage {
  private router = inject(Router);
  public tareasService = inject(TareasService);

  public tareaResource = resource({
    defaultValue: [],
    params: () => {
      return {};
    },
    loader: async ({ params }) => {
      return this.tareasService.obtenerTodos();
    },
  });
  goToCrearTareas() {
    this.router.navigate(['/tareas/create']);
  }
  goToEditarTarea(id: number) {
    this.router.navigate(['/tareas/editar', id]);
  }

  finalizarTarea(id: number) {
    this.tareasService.finalizarTarea(id);
    this.tareaResource.reload();
  }

  eliminarTarea(id: number) {
    this.tareasService.eliminarTarea(id);
    this.tareaResource.reload(); //Volvemos a pedir la lista para que desaparezca la fila.
  }
}
