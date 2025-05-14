import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.sector || !data.ia || !data.impacto || !data.formacion || !data.madurez || !Array.isArray(data.resultado)) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }
  const test = await prisma.testDiagnostico.create({
    data: {
      sector: data.sector,
      ia: data.ia,
      impacto: data.impacto,
      formacion: data.formacion,
      madurez: data.madurez,
      resultado: data.resultado.join(','),
    },
  });
  return NextResponse.json({ ok: true, test });
}

export async function GET() {
  const tests = await prisma.testDiagnostico.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ tests });
} 