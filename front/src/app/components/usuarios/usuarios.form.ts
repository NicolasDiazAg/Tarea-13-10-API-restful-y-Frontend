import { Component, input, linkedSignal, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { usuario, Usuario } from '../../pages/model/usuario';
import { JsonPipe } from '@angular/common';

@Component({
  imports: [FormField, JsonPipe],
  //Acá en el selector le agregue el form pq sino te agarras un pedo en que es que.
  selector: 'app-usuarios-form',
  styleUrl: './usuarios.form.css',
  templateUrl: './usuarios.form.html',
})
export class UsuariosForm {
  public usuario = input.required<Usuario>();

  public usuarioModel = linkedSignal<Usuario>(this.usuario);

  //public nombre = signal('nombreInicial');
  public usuarioForm = form(this.usuarioModel);

  //Esto es para mandar el valor de acá para el componente crear-usuario, es decir del compontnete mas contenido al de arriba.
  public guardarUsuario = output<Usuario>();

  //SIEMPRE USAMOS SIGNALFORMS NO REACTIVE FORMS NI FORMSMODULE

  public submitForm(event: Event) {
    event.preventDefault();
    console.log('submit form en usuario form');
    this.guardarUsuario.emit(this.usuarioForm().value());
  }
}
export default UsuariosForm;
