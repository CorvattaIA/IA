import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import { ChatSession } from '../../lib/types';

export async function POST(req: NextRequest) {
  const data = await req.json();
  // Validación básica
  if (!data.nombre || !data.correo || !data.sector || !data.servicios || !Array.isArray(data.mensajes)) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }
  const session = await prisma.chatSession.create({
    data: {
      nombre: data.nombre,
      correo: data.correo,
      sector: data.sector,
      servicios: data.servicios,
      mensajes: { create: data.mensajes.map((m: { autor: string; texto: string }) => ({ autor: m.autor, texto: m.texto })) },
    },
    include: { mensajes: true },
  });
  return NextResponse.json({ ok: true, session });
}

export async function GET() {
  const chats = await prisma.chatSession.findMany({
    orderBy: { createdAt: 'desc' },
    include: { mensajes: true },
  });
  return NextResponse.json({ chats });
} 