import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/db";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Obtener un evento por ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const events = await prisma.events.findUnique({
      where: { id: parseInt(id) },
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

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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
      where: { id: parseInt(id) },
      data
    });

    return NextResponse.json(eventsActualizado);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// Eliminar un evento
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    await prisma.events.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: "Evento eliminado correctamente" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
