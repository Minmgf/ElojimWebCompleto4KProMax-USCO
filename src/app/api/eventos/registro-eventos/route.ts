import { NextResponse } from "next/server";
import prisma from "@/libs/db";

// POST - Crear inscripción con validación de capacidad
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, numDocument, email, phone, eventId } = body;

    if (!fullName || !numDocument || !eventId) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Buscar evento
    const evento = await prisma.events.findUnique({
      where: { id: parseInt(eventId) },
    });

    if (!evento) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    // Validar estado del evento
    if (evento.status === "Finalizado" || evento.date < new Date()) {
      return NextResponse.json(
        { error: "Este evento ya finalizó, no se permiten más inscripciones" },
        { status: 400 }
      );
    }

    // Validar capacidad
    if (evento.registered >= evento.capacity) {
      return NextResponse.json({ error: "El evento ya alcanzó su capacidad máxima" }, { status: 400 });
    }

    // Crear inscripción
    const nuevaInscripcion = await prisma.inscripciones_por_evento.create({
      data: {
        fullName,
        numDocument,
        email,
        phone,
        eventId: parseInt(eventId),
      },
    });

    // Actualizar contador
    await prisma.events.update({
      where: { id: parseInt(eventId) },
      data: { registered: { increment: 1 } },
    });

    return NextResponse.json(nuevaInscripcion, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una inscripción con este documento en este evento" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// GET - Listar todas las inscripciones
export async function GET() {
  try {
    const inscripciones = await prisma.inscripciones_por_evento.findMany({
      include: { event: true },
    });

    return NextResponse.json(inscripciones);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}