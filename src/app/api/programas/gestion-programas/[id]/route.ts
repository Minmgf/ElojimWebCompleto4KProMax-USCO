import { NextResponse } from "next/server";
import  prisma  from "@/libs/db";

// Obtener un programa por id
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const programa = await prisma.programas.findUnique({
      where: { id: parseInt(id) }
    });

    if (!programa) {
      return NextResponse.json({ error: "Programa no encontrado" }, { status: 404 });
    }

    return NextResponse.json(programa);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Editar un programa
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, longDescription, requirements, benefits, specificInformation } = body;

    const programaActualizado = await prisma.programas.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        longDescription,
        requirements,           
        benefits,               
        specificInformation
      }
    });

    return NextResponse.json(programaActualizado);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Eliminar un programa
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const programa = await prisma.programas.findUnique({
      where: { id: parseInt(id) }
    });

    if (!programa) {
      return NextResponse.json({ error: "Programa no encontrado" }, { status: 404 });
    }

    await prisma.programas.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: "Programa eliminado correctamente" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
