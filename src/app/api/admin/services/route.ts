import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM services ORDER BY name');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, duration, price } = await request.json();

    const [result] = await pool.execute(
      'INSERT INTO services (name, description, duration, price) VALUES (?, ?, ?, ?)',
      [name, description || null, duration, price]
    );

    return NextResponse.json({ success: true, id: (result as { insertId: number }).insertId });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 });
  }
}
