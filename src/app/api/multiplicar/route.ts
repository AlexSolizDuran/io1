import { NextRequest } from "next/server";

export async function POST(req : NextRequest) {
  const body = await req.json(); // recibe los datos del front
  const { numero } = body;

  // procesamos algo
  const resultado = numero * 2;

  return Response.json({ resultado });
}
