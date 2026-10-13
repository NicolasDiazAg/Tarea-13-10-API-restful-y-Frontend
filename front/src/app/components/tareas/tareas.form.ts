import { Component, input, linkedSignal, output } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Tarea } from '../../pages/model/tarea';
import { JsonPipe } from '@angular/common';

@Component({
  imports: [FormField, JsonPipe],
  selector: 'app-tareas',
  styleUrl: './tareas.form.css',
  templateUrl: './tareas.form.html',
})
export class TareasForm {
  //Igual que en usuarios.form: la tarea inicial llega por input (vacía para crear, cargada para editar).
  public tarea = input.required<Tarea>();

  public tareaModel = linkedSignal<Tarea>(this.tarea);
  //public nombre = signal('nombreInicial');
  public tareaForm = form(this.tareaModel);

  //Esto es para mandar el valor de acá para el componente crear-usuario, es decir del compontnete mas contenido al de arriba.
  public guardarTarea = output<Tarea>();

  //SIEMPRE USAMOS SIGNALFORMS NO REACTIVE FORMS NI FORMSMODULE

  public submitForm(event: Event) {
    event.preventDefault();
    console.log('submit form en tarea form');
    this.guardarTarea.emit(this.tareaForm().value());
  }
}

export default TareasForm;
