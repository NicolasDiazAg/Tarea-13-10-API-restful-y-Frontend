import { Component, inject, signal } from '@angular/core';
import UsuariosForm from '../../../components/usuarios/usuarios.form';
import { Usuario } from '../../model/usuario';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  imports: [UsuariosForm],
  selector: 'app-crear-usuario',
  styleUrl: './crear-usuario.page.css',
  templateUrl: './crear-usuario.page.html',
})
export class CrearUsuarioPage {
  private usuarioService = inject(UsuariosService);

  public usuarioVacio: Usuario = {
    id_usuario: 0,
    nombre: '',
    apellido: '',
    username: '',
  };

  public onGuardarUsuarios(usuario: Usuario) {
    this.usuarioService.postUsuario(usuario);
    console.log('CrearUsuarioPage. onCrearUsuario recibió: ', { usuario });
    this.mensaje.set('Usuario creado correctamente!');
  }
  mensaje = signal<string>('');
}

export default CrearUsuarioPage;
