import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT u.*, COUNT(a.id) as appointments_count
      FROM users u
      LEFT JOIN appointments a ON u.id = a.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;
    const [rows] = await pool.execute(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Error al obtener pacientes' }, { status: 500 });
  }
}
