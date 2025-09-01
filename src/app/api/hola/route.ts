import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nombre = searchParams.get("nombre") || "Invitado";

  return NextResponse.json({ mensaje: `Hola ${nombre}!` });
}
