import { NextResponse } from "next/server";
import prisma from "@/libs/db";

// Mapa de reglas de validación por programa (quemado por ahora)
const reglasProgramas = {
  1: { minEdad: 18, maxEdad: null },          // Mujer vulnerable
  2: { minEdad: 15, maxEdad: null },          // Semillero innovación
  3: { minEdad: 8,  maxEdad: 14 },            // Taller STEAM
  4: { minEdad: 5,  maxEdad: 18 },            // Refuerzo escolar
  5: { minEdad: 16, maxEdad: 29 },            // Factoría software
  6: { minEdad: 18, maxEdad: null },          // Voluntariado social
  7: { minEdad: 60, maxEdad: null },          // Economía plateada
};

// GET /api/programas/registro-programas?programaId=1
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const programaId = searchParams.get("programaId");

    const where = programaId ? { programaId: parseInt(programaId) } : {};

    const registros = await prisma.registroPrograma.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { programa: true },
    });

    return NextResponse.json(registros, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Error al traer datos", details: err.message },
      { status: 500 }
    );
  }
}

// POST /api/programas/registro-programas
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      typeDocument,
      gender,
      numDocument,
      fullName,
      birthDate,
      comune,
      socialStratum,
      age,
      etnicalGroup,
      address,
      phone,
      email,
      motivation,
      expectations,
      acceptTerms,
      specificInformation,
      programaId,
    } = body;

    // Validaciones mínimas
    if (!programaId)
      return NextResponse.json(
        { error: "programaId is required" },
        { status: 400 }
      );
    if (!numDocument)
      return NextResponse.json(
        { error: "Numero de documento requerido" },
        { status: 400 }
      );
    if (acceptTerms !== true)
      return NextResponse.json(
        { error: "Debes aceptar los términos y condiciones" },
        { status: 400 }
      );

    // Evitar duplicado
    const exists = await prisma.registroPrograma.findFirst({
      where: { programaId: Number(programaId), numDocument: String(numDocument) },
      select: { id: true },
    });
    if (exists) {
      return NextResponse.json(
        { error: "Ya se encuentra registrado" },
        { status: 409 }
      );
    }

    // Validar reglas específicas del programa (edad)
    const reglas = reglasProgramas[programaId];
    if (reglas) {
      if (reglas.minEdad && Number(age) < reglas.minEdad) {
        return NextResponse.json(
          { error: `Debes tener al menos ${reglas.minEdad} años para inscribirte en este programa` },
          { status: 400 }
        );
      }
      if (reglas.maxEdad && Number(age) > reglas.maxEdad) {
        return NextResponse.json(
          { error: `La edad máxima para este programa es ${reglas.maxEdad} años` },
          { status: 400 }
        );
      }
    }

    // Crear registro
    const created = await prisma.registroPrograma.create({
      data: {
        typeDocument,
        gender,
        numDocument: String(numDocument),
        fullName,
        birthDate: new Date(birthDate),
        comune,
        socialStratum,
        age: Number(age),
        etnicalGroup,
        address,
        phone,
        email,
        motivation,
        expectations,
        acceptTerms: Boolean(acceptTerms),
        specificInformation, // JSON as-is
        programaId: Number(programaId),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    // Si falla por la restricción única
    if (err.code === "P2002") {
      return NextResponse.json(
        {
          error: "El mismo documento no puede estar en el mismo programa",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Error al registrarse", details: err.message },
      { status: 500 }
    );
  }
}
