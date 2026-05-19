import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM personnel ORDER BY name');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching personnel:', error);
    return NextResponse.json({ error: 'Error al obtener personal' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, specialty, email, phone } = await request.json();

    const [result] = await pool.execute(
      'INSERT INTO personnel (name, specialty, email, phone) VALUES (?, ?, ?, ?)',
      [name, specialty, email || null, phone || null]
    );

    return NextResponse.json({ success: true, id: (result as { insertId: number }).insertId });
  } catch (error) {
    console.error('Error creating personnel:', error);
    return NextResponse.json({ error: 'Error al crear personal' }, { status: 500 });
  }
}
