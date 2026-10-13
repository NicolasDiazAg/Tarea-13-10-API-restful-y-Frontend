import { Component, inject, input, resource, signal } from '@angular/core';
import TareasForm from '../../../components/tareas/tareas.form';
import { Tarea } from '../../model/tarea';
import { TareasService } from '../../../services/tareas.service';

@Component({
  imports: [TareasForm],
  selector: 'app-tareas-editar',
  styleUrl: './tareas-editar.page.css',
  templateUrl: './tareas-editar.page.html',
})
export class TareasEditarPage {
  //El id llega desde la ruta (editar/:id) porque usamos withComponentInputBinding.
  public id = input.required<number, string>({
    transform: (value) => Number(value),
  });

  private tareasService = inject(TareasService);

  public tareaResource = resource({
    params: () => {
      const id = this.id();
      if (!id) return undefined;
      return { id };
    },
    loader: async ({ params }) => {
      return this.tareasService.obtenerPorId(params.id);
    },
  });

  public onGuardarTarea(tarea: Tarea) {
    this.tareasService.actualizarTarea(tarea);
    console.log('TareasEditarPage. onGuardarTarea recibió: ', { tarea });
    this.mensaje.set('Tarea actualizada correctamente!');
  }
  mensaje = signal<string>('');
}

export default TareasEditarPage;
