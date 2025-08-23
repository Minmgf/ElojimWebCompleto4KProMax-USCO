// lib/zod.ts
import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "El correo es obligatorio" })
    .min(1, "El correo es obligatorio")
    .email("Correo inválido"),
  password: string({ required_error: "La contraseña es obligatoria" })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
});
