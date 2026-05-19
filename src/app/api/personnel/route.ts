import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM personnel WHERE available = true ORDER BY name');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching personnel:', error);
    return NextResponse.json({ error: 'Error al obtener personal' }, { status: 500 });
  }
}
