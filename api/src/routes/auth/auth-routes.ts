import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { usuariosRepo } from "../../repositories/usuarios-repository.ts";
import { LoginSchema, PayloadSchema, RegistroSchema, UsuarioSchema } from "../../schemas/usuarios-schema.ts";

const authRoutes: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.post(
    "/register",
    {
      schema: {
        tags: ["auth"],
        summary: "Registrar usuario",
        description: "Registro público: el usuario queda siempre en el grupo 'user'.",
        body: RegistroSchema,
        response: {
          201: UsuarioSchema,
          400: Type.Object({ message: Type.String() }),
          409: Type.Object({ message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      // Aunque alguien mande "grupos" en el pedido, se ignora: nadie se registra como admin.
      const usuario = await usuariosRepo.crear({ ...request.body, grupos: ["user"] });
      return reply.status(201).send(usuario);
    },
  );

  fastify.post(
    "/login",
    {
      schema: {
        tags: ["auth"],
        summary: "Login",
        body: LoginSchema,
        response: {
          200: Type.Object({ token: Type.String() }),
          401: Type.Object({ message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const payload = await usuariosRepo.verificarCredenciales(
        request.body.username,
        request.body.password,
      );
      const token = fastify.jwt.sign(payload, { expiresIn: "8h" });
      return reply.status(200).send({ token });
    },
  );

  fastify.get(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["auth"],
        summary: "Obtener usuario del token",
        security: [{ bearerAuth: [] }],
        response: { 200: PayloadSchema, 401: Type.Object({ message: Type.String() }) },
      },
    },
    async (request, reply) => reply.status(200).send(request.user),
  );
};

export default authRoutes;
