import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Rutas que requieren autenticación
  const protectedRoutes = ["/dashboard"];
  
  // Rutas de autenticación
  const authRoutes = ["/login"];

  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Si está en una ruta de auth y ya está logueado, redirigir al dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Si está en una ruta protegida y no está logueado, redirigir al login
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};