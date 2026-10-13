import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { tareasRepo } from "../../repositories/tareas-repository.ts";
import {
	CrearTareaSchema,
	ActualizarTareaSchema,
	FinalizarTareaSchema,
	TareaSchema,
	type Tarea,
} from "../../schemas/tareas-schema.ts";
import type { Grupo, PayloadDTO } from "../../schemas/usuarios-schema.ts";
import { NotAuthorizedError } from "../../errors/response.errors.ts";

function puedeVerGrupo(usuario: PayloadDTO, grupo: Grupo): boolean {
	return usuario.grupos.includes("superadmin") || usuario.grupos.includes(grupo);
}

function puedeModificarTarea(usuario: PayloadDTO, tarea: Tarea): boolean {
	return usuario.grupos.includes("superadmin") || tarea.id_creador === usuario.id_usuario;
}

// Autoload agrega el prefijo /tareas porque este archivo está en la carpeta routes/tareas.
const tareasRoutes: FastifyPluginAsyncTypebox = async (
	fastify,
): Promise<void> => {
	// Todas las rutas exigen un token válido.
	fastify.addHook("onRequest", fastify.authenticate);

	fastify.get(
		"/",
		{
			schema: {
				tags: ["tareas"],
				summary: "Obtener tareas",
				description:
					"Devuelve las tareas de los grupos a los que pertenece el usuario (el superadmin ve todas).",
				security: [{ bearerAuth: [] }],
				response: {
					200: Type.Array(TareaSchema),
					401: Type.Object({ message: Type.String() }),
				},
			},
		},
		async (request, reply) => {
			const todas = await tareasRepo.obtenerTodas();
			const visibles = todas.filter((tarea) =>
				puedeVerGrupo(request.user, tarea.grupo),
			);
			return reply.status(200).send(visibles);
		},
	);

	fastify.get(
		"/:id_tarea",
		{
			schema: {
				tags: ["tareas"],
				summary: "Obtener tarea por ID",
				security: [{ bearerAuth: [] }],
				params: Type.Object({ id_tarea: Type.Integer() }),
				response: {
					200: TareaSchema,
					401: Type.Object({ message: Type.String() }),
					403: Type.Object({ message: Type.String() }),
					404: Type.Object({ message: Type.String() }),
				},
			},
		},
		async (request, reply) => {
			const tarea = await tareasRepo.obtenerPorId(request.params.id_tarea);
			if (!puedeVerGrupo(request.user, tarea.grupo)) {
				throw new NotAuthorizedError("No tiene acceso a las tareas de ese grupo.");
			}
			return reply.status(200).send(tarea);
		},
	);

	fastify.post(
		"/",
		{
			onRequest: [fastify.checkIsAdmin],
			schema: {
				tags: ["tareas"],
				summary: "Crear tarea",
				description:
					"Solo administradores, y solo en un grupo al que pertenecen. Si no se indica prioridad queda en '1:media'.",
				security: [{ bearerAuth: [] }],
				body: CrearTareaSchema,
				response: {
					201: TareaSchema,
					400: Type.Object({ message: Type.String() }),
					401: Type.Object({ message: Type.String() }),
					403: Type.Object({ message: Type.String() }),
				},
			},
		},
		async (request, reply) => {
			if (!puedeVerGrupo(request.user, request.body.grupo)) {
				throw new NotAuthorizedError(
					"No puede crear tareas en un grupo al que no pertenece.",
				);
			}
			const tarea = await tareasRepo.crear(
				request.user.id_usuario,
				request.body,
			);
			return reply.status(201).send(tarea);
		},
	);

	fastify.put(
		"/:id_tarea",
		{
			schema: {
				tags: ["tareas"],
				summary: "Actualizar tarea",
				description:
					"Solo el creador de la tarea o un superadmin. Solo se modifican los campos enviados.",
				security: [{ bearerAuth: [] }],
				params: Type.Object({ id_tarea: Type.Integer() }),
				body: ActualizarTareaSchema,
				response: {
					200: TareaSchema,
					400: Type.Object({ message: Type.String() }),
					401: Type.Object({ message: Type.String() }),
					403: Type.Object({ message: Type.String() }),
					404: Type.Object({ message: Type.String() }),
				},
			},
		},
		async (request, reply) => {
			const { id_tarea } = request.params;
			const tarea = await tareasRepo.obtenerPorId(id_tarea);
			if (!puedeModificarTarea(request.user, tarea)) {
				throw new NotAuthorizedError(
					"Solo el creador o un superadmin pueden modificar esta tarea.",
				);
			}
			const nuevoGrupo = request.body.grupo;
			if (nuevoGrupo && !puedeVerGrupo(request.user, nuevoGrupo)) {
				throw new NotAuthorizedError(
					"No puede mover la tarea a un grupo al que no pertenece.",
				);
			}
			return reply
				.status(200)
				.send(await tareasRepo.actualizar(id_tarea, request.body));
		},
	);

	fastify.patch(
		"/:id_tarea/finalizar",
		{
			schema: {
				tags: ["tareas"],
				summary: "Finalizar tarea",
				description:
					"Solo el creador de la tarea o un superadmin. Si no se envía fecha se usa el momento actual. Enviar un body vacío: {}",
				security: [{ bearerAuth: [] }],
				params: Type.Object({ id_tarea: Type.Integer() }),
				body: FinalizarTareaSchema,
				response: {
					200: TareaSchema,
					401: Type.Object({ message: Type.String() }),
					403: Type.Object({ message: Type.String() }),
					404: Type.Object({ message: Type.String() }),
					409: Type.Object({ message: Type.String() }),
				},
			},
		},
		async (request, reply) => {
			const { id_tarea } = request.params;
			const tarea = await tareasRepo.obtenerPorId(id_tarea);
			if (!puedeModificarTarea(request.user, tarea)) {
				throw new NotAuthorizedError(
					"Solo el creador o un superadmin pueden finalizar esta tarea.",
				);
			}
			return reply
				.status(200)
				.send(await tareasRepo.finalizar(id_tarea, request.body.fecha));
		},
	);

	fastify.delete(
		"/:id_tarea",
		{
			schema: {
				tags: ["tareas"],
				summary: "Eliminar tarea",
				description: "Solo el creador de la tarea o un superadmin.",
				security: [{ bearerAuth: [] }],
				params: Type.Object({ id_tarea: Type.Integer() }),
				response: {
					204: Type.Null(),
					401: Type.Object({ message: Type.String() }),
					403: Type.Object({ message: Type.String() }),
					404: Type.Object({ message: Type.String() }),
				},
			},
		},
		async (request, reply) => {
			const { id_tarea } = request.params;
			const tarea = await tareasRepo.obtenerPorId(id_tarea);
			if (!puedeModificarTarea(request.user, tarea)) {
				throw new NotAuthorizedError(
					"Solo el creador o un superadmin pueden eliminar esta tarea.",
				);
			}
			await tareasRepo.eliminar(id_tarea);
			return reply.status(204).send(null);
		},
	);
};

export default tareasRoutes;
