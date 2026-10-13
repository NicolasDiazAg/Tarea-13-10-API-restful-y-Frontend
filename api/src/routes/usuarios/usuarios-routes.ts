import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { usuariosRepo } from "../../repositories/usuarios-repository.ts";
import {
  ActualizarUsuarioSchema,
  CrearUsuarioSchema,
  UsuarioSchema,
  type Grupo,
  type PayloadDTO,
} from "../../schemas/usuarios-schema.ts";
import { NotAuthorizedError } from "../../errors/response.errors.ts";

function esAdmin(usuario: PayloadDTO): boolean {
  return usuario.grupos.includes("admin") || usuario.grupos.includes("superadmin");
}

function puedeAsignarGrupos(usuario: PayloadDTO, grupos: Grupo[]): boolean {
  return usuario.grupos.includes("superadmin") || !grupos.includes("superadmin");
}

// Autoload agrega el prefijo /usuarios porque este archivo está en la carpeta routes/usuarios.
const usuariosRoutes: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  // Todas las rutas exigen un token válido.
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get(
    "/",
    {
      schema: {
        tags: ["usuarios"],
        summary: "Obtener usuarios",
        description: "Un administrador recibe todos los usuarios; los demás, solo el suyo.",
        security: [{ bearerAuth: [] }],
        response: {
          200: Type.Array(UsuarioSchema),
          401: Type.Object({ message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      if (esAdmin(request.user)) {
        return reply.status(200).send(await usuariosRepo.obtenerTodos());
      }
      const propio = await usuariosRepo.obtenerPorId(request.user.id_usuario);
      return reply.status(200).send([propio]);
    },
  );

  fastify.get(
    "/:id_usuario",
    {
      schema: {
        tags: ["usuarios"],
        summary: "Obtener usuario por ID",
        description: "Un administrador puede ver a cualquiera; los demás, solo a sí mismos.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({ id_usuario: Type.Integer() }),
        response: {
          200: UsuarioSchema,
          401: Type.Object({ message: Type.String() }),
          403: Type.Object({ message: Type.String() }),
          404: Type.Object({ message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const { id_usuario } = request.params;
      if (!esAdmin(request.user) && request.user.id_usuario !== id_usuario) {
        throw new NotAuthorizedError("No puede consultar a otro usuario.");
      }
      return reply.status(200).send(await usuariosRepo.obtenerPorId(id_usuario));
    },
  );

  fastify.post(
    "/",
    {
      onRequest: [fastify.checkIsAdmin],
      schema: {
        tags: ["usuarios"],
        summary: "Crear usuario",
        description:
          "Solo administradores. Si no se indican grupos queda en 'user'. Solo un superadmin puede crear otro superadmin.",
        security: [{ bearerAuth: [] }],
        body: CrearUsuarioSchema,
        response: {
          201: UsuarioSchema,
          400: Type.Object({ message: Type.String() }),
          401: Type.Object({ message: Type.String() }),
          403: Type.Object({ message: Type.String() }),
          409: Type.Object({ message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      if (!puedeAsignarGrupos(request.user, request.body.grupos ?? [])) {
        throw new NotAuthorizedError("Solo un superadmin puede asignar el grupo superadmin.");
      }
      const usuario = await usuariosRepo.crear(request.body);
      return reply.status(201).send(usuario);
    },
  );

  fastify.put(
    "/:id_usuario",
    {
      schema: {
        tags: ["usuarios"],
        summary: "Actualizar usuario",
        description:
          "Un administrador puede modificar a cualquiera. Los demás solo a sí mismos y sin cambiar sus grupos ni 'activo'. Solo se modifican los campos enviados.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({ id_usuario: Type.Integer() }),
        body: ActualizarUsuarioSchema,
        response: {
          200: UsuarioSchema,
          400: Type.Object({ message: Type.String() }),
          401: Type.Object({ message: Type.String() }),
          403: Type.Object({ message: Type.String() }),
          404: Type.Object({ message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const { id_usuario } = request.params;
      const cambios = request.body;
      const admin = esAdmin(request.user);

      if (!admin && request.user.id_usuario !== id_usuario) {
        throw new NotAuthorizedError("No puede modificar a otro usuario.");
      }
      if (!admin && (cambios.grupos !== undefined || cambios.activo !== undefined)) {
        throw new NotAuthorizedError("No puede modificar sus grupos ni su estado.");
      }
      if (cambios.grupos && !puedeAsignarGrupos(request.user, cambios.grupos)) {
        throw new NotAuthorizedError("Solo un superadmin puede asignar el grupo superadmin.");
      }
      return reply.status(200).send(await usuariosRepo.actualizar(id_usuario, cambios));
    },
  );

  fastify.delete(
    "/:id_usuario",
    {
      onRequest: [fastify.checkIsAdmin],
      schema: {
        tags: ["usuarios"],
        summary: "Eliminar usuario",
        description: "Solo administradores. También se borran sus credenciales y sus tareas.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({ id_usuario: Type.Integer() }),
        response: {
          204: Type.Null(),
          401: Type.Object({ message: Type.String() }),
          403: Type.Object({ message: Type.String() }),
          404: Type.Object({ message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      await usuariosRepo.eliminar(request.params.id_usuario);
      return reply.status(204).send(null);
    },
  );
};

export default usuariosRoutes;
