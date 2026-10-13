import fp from "fastify-plugin";
import { STATUS_CODES } from "node:http";
import {
  transformarErrorPostgres,
  type PostgresError,
} from "../errors/response.errors.ts";

// Los errores de Postgres traen un código de 5 caracteres, por ejemplo "23505" (valor duplicado).
const esErrorPostgres = (error: any): error is PostgresError =>
  typeof error?.code === "string" && /^\d\d[0-9A-Z]{3}$/.test(error.code);

// Un único manejador de errores para toda la API. Va en un plugin (y no en app.ts) porque
// tiene que registrarse ANTES que las rutas: autoload carga primero la carpeta plugins/.
export default fp(async (fastify) => {
  fastify.setErrorHandler((error: any, request, reply) => {
    fastify.log.info({ error });

    // Si viene de Postgres lo convertimos a nuestros errores (409, 400...); si no, queda como está.
    const e = esErrorPostgres(error) ? transformarErrorPostgres(error) : error;
    const statusCode: number = e.statusCode ?? 500;

    return reply.status(statusCode).send({
      statusCode,
      code: e.code,
      error: STATUS_CODES[statusCode] ?? "Error",
      message: e.message,
    });
  });
});
