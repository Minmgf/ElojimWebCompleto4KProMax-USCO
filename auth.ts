import { signInSchema } from "@/libs/zod";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import db from "./src/libs/db";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
    updateAge: 30 * 60,
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        try {
          // Validar entradas
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // Buscar el usuario en la base de datos
          const userFound = await db.users.findUnique({
            where: {
              email: email,
            },
          });

          if (!userFound) {
            throw new Error("Credenciales incorrectas");
          }

          // Verificar contraseña
          const isPasswordValid = await bcrypt.compare(password, userFound.password);
          
          if (!isPasswordValid) {
            throw new Error("Credenciales incorrectas");
          }

          console.log(
            `Inicio de sesión exitoso para el usuario: ${userFound.name}`
          );

          return {
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            // Si falla validación, retorna null
            return null;
          }
          // Otras excepciones de autorización
          return null;
        }
      },
    }),
  ],
});
