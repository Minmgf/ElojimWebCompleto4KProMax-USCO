// lib/zod.ts
import { z, object, string } from "zod";

export const signInSchema = object({
  email: string({ message: "El correo es obligatorio" })
    .min(1, "El correo es obligatorio")
    .email("Correo inválido"),
  password: string({ message: "La contraseña es obligatoria" })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
});

// Schema para crear una noticia
export const createNewsSchema = z.object({
  title: z.string().min(1, { message: "El título es requerido" }).max(255, { message: "El título es muy largo" }),
  content: z.string().min(1, { message: "El contenido es requerido" }),
  category: z.array(z.string()).min(1, { message: "Al menos una categoría es requerida" }),
  important: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// Schema para actualizar una noticia
export const updateNewsSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  category: z.array(z.string()).optional(),
  important: z.boolean().optional(),
  isActive: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "Al menos un campo debe ser proporcionado para la actualización"
});

// Schema para parámetros de consulta
export const newsQuerySchema = z.object({
  page: z.string().nullable().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().nullable().optional().transform(val => val ? parseInt(val) : 10),
  category: z.string().nullable().optional(),
  important: z.string().nullable().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
  isActive: z.string().nullable().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
  search: z.string().nullable().optional(),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type NewsQueryInput = z.infer<typeof newsQuerySchema>;
