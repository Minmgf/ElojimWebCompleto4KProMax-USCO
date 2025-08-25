import { NextResponse } from "next/server";
import prisma from "@/libs/db";


export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const inscripcionId = Number(params.id);
    if (!Number.isInteger(inscripcionId)) {
      return NextResponse.json(
        { error: "El parámetro id debe ser numérico" },
        { status: 400 }
      );
    }

    // 1) Buscamos la inscripción base por su ID (para obtener los datos de la persona)
    const inscripcion = await prisma.inscripciones_por_evento.findUnique({
      where: { id: inscripcionId },
    });

    if (!inscripcion) {
      return NextResponse.json(
        { error: "Inscripción no encontrada" },
        { status: 404 }
      );
    }

    // 2) Con el numDocument de esa inscripción, buscamos TODAS sus inscripciones e incluimos el evento
    const inscripcionesDeLaPersona = await prisma.inscripciones_por_evento.findMany({
      where: { numDocument: inscripcion.numDocument },
      include: { event: true },
      orderBy: { createdAt: "asc" },
    });

    // 3) Extraemos solo los eventos (sin duplicados)
    const eventosMap = new Map<number, typeof inscripcionesDeLaPersona[number]["event"]>();
    for (const i of inscripcionesDeLaPersona) {
      eventosMap.set(i.event.id, i.event);
    }
    const eventos = Array.from(eventosMap.values());

    // 4) Respuesta compuesta: datos de la persona + eventos
    return NextResponse.json(
      {
        persona: {
          fullName: inscripcion.fullName,
          numDocument: inscripcion.numDocument,
          email: inscripcion.email,
          phone: inscripcion.phone,
        },
        eventos,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al obtener eventos por inscripción:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
