import fp from "fastify-plugin";
import jwt, { type FastifyJwtNamespace } from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { PayloadDTO } from "../schemas/usuarios-schema.ts";
import {
	NotAuthorizedError,
	UnAuthenticatedError,
} from "../errors/response.errors.ts";

export default fp(async (fastify) => {
	const secreto = process.env.FASTIFY_SECRET;
	if (!secreto) throw new Error("No especificaste FASTIFY_SECRET");

	await fastify.register(jwt, { secret: secreto });

	// Verifica que el pedido traiga un token válido (401 si no). Deja el contenido en request.user.
	fastify.decorate(
		"authenticate",
		async function (request: FastifyRequest, reply: FastifyReply) {
			try {
				await request.jwtVerify();
			} catch {
				throw new UnAuthenticatedError("");
			}
		},
	);

	// Token válido y usuario del grupo admin o superadmin (403 si no).
	fastify.decorate(
		"checkIsAdmin",
		async function (request: FastifyRequest, reply: FastifyReply) {
			try {
				await request.jwtVerify();
			} catch {
				throw new UnAuthenticatedError("");
			}
			if (
				!request.user.grupos.includes("admin") &&
				!request.user.grupos.includes("superadmin")
			) {
				throw new NotAuthorizedError("");
			}
		},
	);

	// Token válido y usuario del grupo superadmin (403 si no).
	fastify.decorate(
		"isSuperAdmin",
		async function (request: FastifyRequest, reply: FastifyReply) {
			try {
				await request.jwtVerify();
			} catch {
				throw new UnAuthenticatedError("");
			}
			if (!request.user.grupos.includes("superadmin")) {
				throw new NotAuthorizedError("");
			}
		},
	);
});

// Le enseña a TypeScript que fastify tiene estos decoradores y qué forma tiene el contenido del token.
declare module "fastify" {
	interface FastifyInstance extends FastifyJwtNamespace<{}> {
		authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
		checkIsAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void>;
		isSuperAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void>;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: PayloadDTO;
		user: PayloadDTO;
	}
}
