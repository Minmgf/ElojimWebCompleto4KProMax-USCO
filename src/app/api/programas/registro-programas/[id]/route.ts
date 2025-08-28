import { NextResponse } from "next/server";
import  prisma  from "@/libs/db";

// GET /api/programas/registro-programas/[id]
export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const registro = await prisma.registroPrograma.findUnique({
      where: { id: Number(id) },
      include: { programa: true },
    });
    if (!registro) return NextResponse.json({ error: "No se encontro el registro" }, { status: 404 });
    return NextResponse.json(registro, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Error al cargar los datos", details: err.message }, { status: 500 });
  }
}

// PUT /api/programas/registro-programas/:id
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.registroPrograma.update({
      where: { id: Number(id) },
      data: {
        ...(body.typeDocument !== undefined && { typeDocument: body.typeDocument }),
        ...(body.gender !== undefined && { gender: body.gender }),
        ...(body.numDocument !== undefined && { numDocument: String(body.numDocument) }),
        ...(body.fullName !== undefined && { fullName: body.fullName }),
        ...(body.birthDate !== undefined && { birthDate: new Date(body.birthDate) }),
        ...(body.comune !== undefined && { comune: body.comune }),
        ...(body.socialStratum !== undefined && { socialStratum: body.socialStratum }),
        ...(body.age !== undefined && { age: Number(body.age) }),
        ...(body.etnicalGroup !== undefined && { etnicalGroup: body.etnicalGroup }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.motivation !== undefined && { motivation: body.motivation }),
        ...(body.expectations !== undefined && { expectations: body.expectations }),
        ...(body.acceptTerms !== undefined && { acceptTerms: Boolean(body.acceptTerms) }),
        ...(body.specificInformation !== undefined && { specificInformation: body.specificInformation }),
        ...(body.programaId !== undefined && { programaId: Number(body.programaId) }),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Ya esta registrada esta persona" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Error updating record", details: err.message }, { status: 500 });
  }
}

// DELETE /api/programas/registro-programas/:id
export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    await prisma.registroPrograma.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Registro eliminado" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Error al intenar eliminar le registro", details: err.message }, { status: 500 });
  }
}
