import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { EventStatus } from "@prisma/client";

// ✅ POST: Crear un nuevo evento
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, date, location, duration, capacity, status,  programasIds } = body;

    // Validación básica
    if (!name || !description || !date || !location || !duration || !status || !capacity) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Crear evento
    const newEvent = await prisma.events.create({
      data: {
        name,
        description,
        date: new Date(date),
        location,
        duration: Number(duration),
        capacity: Number(capacity),
        status: status as EventStatus,
        updatedAt: new Date(),
        ...(programasIds && programasIds.length > 0
          ? {
              programas: {
                connect: programasIds.map((id: number) => ({ id })),
              },
            }
          : {}),
      },
      include: {
        programas: true,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    console.error("Error al crear evento:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ GET: Listar todos los eventos con programas e inscripciones
export async function GET() {
  try {
    const eventos = await prisma.events.findMany({
      include: {
        programas: true,
        inscripciones: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(eventos, { status: 200 });
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return NextResponse.json({ error: "Error al obtener eventos" }, { status: 500 });
  }
}
