import { db } from '../../../../lib/db'; 
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows]: any = await db.query('SELECT limite, gastos_json FROM configuracion_app WHERE id = 1');
    if (rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    const row = rows[0];
    return NextResponse.json({
      limite: row.limite,
      gastos: JSON.parse(row.gastos_json),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    
  try {
    const body = await req.json();
    const { limite, gastos } = body;

    if (typeof limite === 'undefined' || !Array.isArray(gastos)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    await db.query(
      "UPDATE configuracion_app SET limite = ?, gastos_json = ? WHERE id = 1",
      [limite, JSON.stringify(gastos)]
    );

    return NextResponse.json({ mensaje: "Actualizado correctamente" });
  } catch (error) {
    console.error("[API POST ERROR]", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}