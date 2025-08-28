import { NextResponse } from "next/server";
import prisma from "@/libs/db";

// GET /api/programas/registros-by-programa/[idPrograma]
export async function GET(req, { params }) {
  try {
    const { idPrograma } = await params;
    const { searchParams } = new URL(req.url);
    
    if (!idPrograma) {
      return NextResponse.json(
        { error: "ID del programa es requerido" },
        { status: 400 }
      );
    }

    // Validar que el ID sea un número válido
    const programaId = parseInt(idPrograma);
    if (isNaN(programaId)) {
      return NextResponse.json(
        { error: "ID del programa debe ser un número válido" },
        { status: 400 }
      );
    }

    // Obtener parámetros de paginación y búsqueda
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Validar parámetros
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Parámetros de paginación inválidos" },
        { status: 400 }
      );
    }

    // Buscar el programa para verificar que existe
    const programa = await prisma.programas.findUnique({
      where: { id: programaId },
      select: { id: true, name: true }
    });

    if (!programa) {
      return NextResponse.json(
        { error: "Programa no encontrado" },
        { status: 404 }
      );
    }

    // Construir where clause para búsqueda
    const where: any = {
      programaId: programaId
    };

    // Agregar filtro de búsqueda si se proporciona
    if (search.trim()) {
      where.fullName = {
        contains: search.trim(),
        mode: 'insensitive' // Búsqueda case-insensitive
      };
    }

    // Obtener total de registros para paginación
    const totalRegistros = await prisma.registroPrograma.count({
      where
    });

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Obtener registros paginados
    const registros = await prisma.registroPrograma.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        programa: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    // Calcular información de paginación
    const totalPages = Math.ceil(totalRegistros / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Preparar la respuesta con información del programa, registros y paginación
    const response = {
      programa: {
        id: programa.id,
        name: programa.name
      },
      totalRegistros,
      registros: registros.map(registro => ({
        id: registro.id,
        fullName: registro.fullName,
        numDocument: registro.numDocument,
        typeDocument: registro.typeDocument,
        age: registro.age,
        gender: registro.gender,
        comune: registro.comune,
        socialStratum: registro.socialStratum,
        email: registro.email,
        phone: registro.phone,
        motivation: registro.motivation,
        expectations: registro.expectations,
        specificInformation: registro.specificInformation,
        createdAt: registro.createdAt,
        updatedAt: registro.updatedAt
      })),
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        pageSize: limit,
        totalCount: totalRegistros
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error obteniendo registros del programa:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor al obtener registros",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/programas/registros-by-programa/[idPrograma] - Para crear registros específicos del programa
export async function POST(req, { params }) {
  try {
    const { idPrograma } = await params;
    const body = await req.json();

    if (!idPrograma) {
      return NextResponse.json(
        { error: "ID del programa es requerido" },
        { status: 400 }
      );
    }

    const programaId = parseInt(idPrograma);
    if (isNaN(programaId)) {
      return NextResponse.json(
        { error: "ID del programa debe ser un número válido" },
        { status: 400 }
      );
    }

    // Verificar que el programa existe
    const programa = await prisma.programas.findUnique({
      where: { id: programaId },
      select: { id: true }
    });

    if (!programa) {
      return NextResponse.json(
        { error: "Programa no encontrado" },
        { status: 404 }
      );
    }

    // Crear el registro con el programaId del parámetro
    const created = await prisma.registroPrograma.create({
      data: {
        ...body,
        programaId: programaId
      },
      include: {
        programa: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(created, { status: 201 });

  } catch (error) {
    console.error("Error creando registro del programa:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un registro con este documento para este programa" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: "Error interno del servidor al crear registro",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
