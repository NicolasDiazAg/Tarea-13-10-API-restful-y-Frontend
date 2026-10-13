import { Service } from '@angular/core';
import { Usuario } from '../pages/model/usuario';

@Service()
export class UsuariosService {
  usuarios: Usuario[] = [
    { id_usuario: 1, nombre: 'Jorge', apellido: 'Melnik', username: 'jmelnik' },
    { id_usuario: 2, nombre: 'Joe', apellido: 'Doe', username: 'JDoe777' },
    { id_usuario: 3, nombre: 'Luffy', apellido: 'Monkey D', username: 'PirateKing' },
  ];

  lastIdUsuario = 3;

  // Devolvemos una copia del array para que la página detecte el cambio cuando se vuelve a pedir la lista.
  getUsuarios() {
    return [...this.usuarios];
  }

  // Se busca por id (no por posición): si se borra un usuario, las posiciones dejan de coincidir con los ids.
  async getById(id: number) {
    const usuario = this.usuarios.find((u) => u.id_usuario === id);
    return usuario ? { ...usuario } : undefined;
  }

  postUsuario(user: Usuario) {
    this.lastIdUsuario++;
    // Guardamos una copia: si guardáramos el mismo objeto del formulario, al crear dos veces seguidas
    // quedarían dos filas apuntando al mismo objeto.
    this.usuarios.push({ ...user, id_usuario: this.lastIdUsuario });
  }

  putUsuario(user: Usuario) {
    this.usuarios = this.usuarios.map((u) => (u.id_usuario === user.id_usuario ? { ...user } : u));
  }

  deleteUsuario(id: number) {
    this.usuarios = this.usuarios.filter((u) => u.id_usuario !== id);
  }
}
