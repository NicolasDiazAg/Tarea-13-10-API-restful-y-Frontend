import { Component, computed, inject, resource, Signal } from '@angular/core';
import { usuario, Usuario } from '../../model/usuario';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  imports: [],
  selector: 'app-listar-usuarios',
  styleUrl: './listar-usuarios.page.css',
  templateUrl: './listar-usuarios.page.html',
})
export class ListarUsuariosPage {
  private router = inject(Router); //Siempre es recomendado usar inject para utilizar dependencias.
  private usuarioService = inject(UsuariosService);

  public usuarios = computed<Usuario[]>(() => {
    const usuarios = this.usuarioResource.value();
    return usuarios;
  });
  public usuarioResource = resource({
    defaultValue: [],
    params: () => {
      return {};
    },
    loader: async () => {
      return this.usuarioService.getUsuarios();
    },
  });

  goToCrearUsuario() {
    this.router.navigate(['/usuarios/create']);
  }

  goToEditarUsuario(id: number) {
    this.router.navigate(['/usuarios/editar', id]);
  }

  eliminarUsuario(id: number) {
    this.usuarioService.deleteUsuario(id);
    this.usuarioResource.reload(); //Volvemos a pedir la lista para que desaparezca la fila.
  }
}

export default ListarUsuariosPage;
