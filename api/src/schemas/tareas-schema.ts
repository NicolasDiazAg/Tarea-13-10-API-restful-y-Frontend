import { Type, type Static } from "@sinclair/typebox";
import { GrupoSchema } from "./usuarios-schema.ts";

// Mismos valores que el CHECK de la tabla tareas (el número inicial permite ordenar).
export const PrioridadSchema = Type.Union([
	Type.Literal("0:baja"),
	Type.Literal("1:media"),
	Type.Literal("2:alta"),
]);

export const TareaSchema = Type.Object({
	id_tarea: Type.Integer(),
	id_creador: Type.Integer(),
	grupo: GrupoSchema,
	titulo: Type.String(),
	descripcion: Type.Union([Type.String(), Type.Null()]),
	prioridad: PrioridadSchema,
	creada: Type.String({ format: "date-time" }),
	terminada: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
	estado: Type.String(),
});

export const CrearTareaSchema = Type.Object({
	grupo: GrupoSchema,
	titulo: Type.String({ minLength: 1, maxLength: 100 }),
	descripcion: Type.String({ minLength: 1, maxLength: 500 }),
	prioridad: Type.Optional(PrioridadSchema),
});

export const ActualizarTareaSchema = Type.Partial(
	Type.Object({
		grupo: GrupoSchema,
		titulo: Type.String({ minLength: 1, maxLength: 100 }),
		descripcion: Type.String({ minLength: 1, maxLength: 500 }),
		prioridad: PrioridadSchema,
	}),
);

export const FinalizarTareaSchema = Type.Object({
	fecha: Type.Optional(Type.String({ format: "date-time" })),
});

export type Tarea = Static<typeof TareaSchema>;
export type CrearTareaDTO = Static<typeof CrearTareaSchema>;
export type ActualizarTareaDTO = Static<typeof ActualizarTareaSchema>;
export type FinalizarTareaDTO = Static<typeof FinalizarTareaSchema>;
