import { Component, inject, signal } from '@angular/core';
import { Tarea } from '../../model/tarea';
import TareasForm from '../../../components/tareas/tareas.form';
import { TareasService } from '../../../services/tareas.service';

@Component({
  imports: [TareasForm],
  selector: 'app-tareas-crear',
  styleUrl: './tareas-crear.page.css',
  templateUrl: './tareas-crear.page.html',
})
export class TareasCrearPage {
  private tareasService = inject(TareasService);

  public tareaVacia: Tarea = {
    id_tarea: 0,
    id_creador: 0,
    grupo: '',
    titulo: '',
    descripcion: '',
    prioridad: '',
    creada: '',
    terminada: '',
    estado: '',
  };

  public onGuardarTarea(tarea: Tarea) {
    this.tareasService.crearTarea(tarea);
    console.log('TareasCrearPage. onGuardarTarea recibió: ', { tarea });
    this.mensaje.set('Tarea creada correctamente!');
  }
  mensaje = signal<string>('');
}

export default TareasCrearPage; //ESTO ES PARA QUE EN LAS RUTAS SE PUEDA USAR LA FORMA CORTA EN loadChildren: () => import('./tareas.routes') y eso, sin esto falla (ni puta idea porque pero el profe dijo que lo usemos)
