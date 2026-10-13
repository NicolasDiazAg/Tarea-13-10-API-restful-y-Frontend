import { Service } from '@angular/core';
import { Tarea } from '../pages/model/tarea';

@Service()
export class TareasService {
  public tareas: Tarea[] = [
    {
      id_tarea: 1,
      id_creador: 1,
      grupo: 'admin',
      titulo: 'Corregir tarea a estudiantes',
      descripcion: 'Corregir la tarea Angular Tarea 1 a estudiantes',
      prioridad: 'alta',
      creada: '2026/09/25',
      terminada: '',
      estado: 'Abierta',
    },
    {
      id_tarea: 2,
      id_creador: 2,
      grupo: 'user',
      titulo: 'Lorem Ipsum',
      descripcion:
        'Lorem ipsum dolor sit amet. Et galisum provident ab optio cumque vel molestias voluptatem eos adipisci aliquam id nobis esse qui consequatur fugit?',
      prioridad: 'baja',
      creada: '2026/10/04',
      terminada: '2026/10/05',
      estado: 'Cerrada',
    },
    {
      id_tarea: 3,
      id_creador: 3,
      grupo: 'superadmin',
      titulo: 'Convertirse en el rey de los piratas.',
      descripcion: 'Declararle la guerra al gobierno mundial y encontrar el one piece.',
      prioridad: 'alta',
      creada: '1997/07/22',
      terminada: '',
      estado: 'Abierta',
    },
    {
      id_tarea: 4,
      id_creador: 1,
      grupo: 'user',
      titulo: 'Aprobar a mi grupo favorito',
      descripcion: 'Aprobar a mis estudiantes favoritos equipo gym porque son muy trabajadores.',
      prioridad: 'alta',
      creada: '2026/10/04',
      terminada: '2026/11/20',
      estado: 'Cerrada',
    },
  ];

  public lastIdTarea = 4;

  // Devolvemos una copia del array para que la página detecte el cambio cuando se vuelve a pedir la lista.
  public async obtenerTodos() {
    return [...this.tareas];
  }

  public async obtenerPorId(id: number) {
    const tarea = this.tareas.find((t) => t.id_tarea === id);
    return tarea ? { ...tarea } : undefined;
  }

  public crearTarea(tarea: Tarea) {
    this.lastIdTarea++;
    this.tareas.push({ ...tarea, id_tarea: this.lastIdTarea });
  }

  public actualizarTarea(tarea: Tarea) {
    this.tareas = this.tareas.map((t) => (t.id_tarea === tarea.id_tarea ? { ...tarea } : t));
  }

  public eliminarTarea(id: number) {
    this.tareas = this.tareas.filter((t) => t.id_tarea !== id);
  }

  public finalizarTarea(id: number) {
    this.tareas = this.tareas.map((t) =>
      t.id_tarea === id
        ? { ...t, estado: 'Cerrada', terminada: new Date().toLocaleDateString('es-UY') }
        : t,
    );
  }
}
