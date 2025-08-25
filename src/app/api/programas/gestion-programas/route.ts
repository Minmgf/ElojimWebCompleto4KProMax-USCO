import { NextResponse } from "next/server";
import  prisma  from "@/libs/db";

// Listar todos los programas
export async function GET() {
  try {
    const programas = await prisma.programas.findMany();
    return NextResponse.json(programas);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Crear un nuevo programa
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, longDescription, requirements, benefits, specificInformation } = body;

    const nuevoPrograma = await prisma.programas.create({
      data: {
        name,
        description,
        longDescription,
        requirements,           // Array de strings
        benefits,               // Array de strings
        specificInformation     // JSON
      }
    });

    return NextResponse.json(nuevoPrograma, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
