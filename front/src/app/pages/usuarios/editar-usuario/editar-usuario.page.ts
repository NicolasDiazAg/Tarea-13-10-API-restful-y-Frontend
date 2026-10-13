import { Component, inject, input, resource, signal } from '@angular/core';
import UsuariosForm from '../../../components/usuarios/usuarios.form';
import { Usuario } from '../../model/usuario';
import { JsonPipe } from '@angular/common';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  imports: [UsuariosForm, JsonPipe],
  selector: 'app-editar-usuario',
  styleUrl: './editar-usuario.page.css',
  templateUrl: './editar-usuario.page.html',
})
export class EditarUsuarioPage {
  public id = input.required<number, string>({
    transform: (value) => Number(value),
  });

  private _usuarioService = inject(UsuariosService);

  public usuarioResource = resource({
    params: () => {
      const id = this.id();
      if (!id) return undefined;
      return { id };
    },
    loader: async ({ params }) => {
      const { id } = params;
      return this._usuarioService.getById(id);
    },
  });

  public onGuardarUsuarios(usuario: Usuario) {
    this._usuarioService.putUsuario(usuario);
    console.log('EditarUsuarioPage. onCrearUsuario recibió: ', { usuario });
    this.mensaje.set('Usuario actualizado correctamente!');
  }
  mensaje = signal<string>('');
}
