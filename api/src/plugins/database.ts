import { Pool, types, type PoolConfig } from "pg";

// Por defecto "pg" convierte las columnas DATE (fecha_nacimiento) en objetos Date de JavaScript,
// y según la zona horaria del servidor la fecha puede correrse un día. Con esto llega como "YYYY-MM-DD".
types.setTypeParser(types.builtins.DATE, (valor: string) => valor);

const pgConfig: PoolConfig = {
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGHOSTPORT || process.env.PGPORT || 5433),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "parcial",
  max: 10,
  idleTimeoutMillis: 10000,
};

export const myPool = new Pool(pgConfig);
