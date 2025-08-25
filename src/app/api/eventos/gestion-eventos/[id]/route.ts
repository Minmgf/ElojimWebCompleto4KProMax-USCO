import { NextResponse } from "next/server";
import prisma from "@/libs/db";

// Obtener un evento por ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const events = await prisma.events.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        programas: true,
        inscripciones: true
      }
    });

    if (!events) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, description, date, location, duration, status, capacity } = body;

    const data: any = {};

    if (name) data.name = name;
    if (description) data.description = description;
    if (location) data.location = location;
    if (status) data.status = status;

    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ error: "Formato de fecha inválido" }, { status: 400 });
      }
      data.date = parsedDate;
    }

    if (duration !== undefined) {
      if (typeof duration !== "number" || duration <= 0) {
        return NextResponse.json({ error: "Duración inválida" }, { status: 400 });
      }
      data.duration = duration;
    }

    if (capacity !== undefined) {
      if (typeof capacity !== "number" || capacity < 0) {
        return NextResponse.json({ error: "Capacidad inválida" }, { status: 400 });
      }
      data.capacity = capacity;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No se enviaron campos para actualizar" }, { status: 400 });
    }

    const eventsActualizado = await prisma.events.update({
      where: { id: parseInt(params.id) },
      data
    });

    return NextResponse.json(eventsActualizado);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// Eliminar un evento
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.events.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({ message: "Evento eliminado correctamente" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
