import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT a.*, u.name as user_name, u.email as user_email, s.name as service_name, s.price, p.name as personnel_name 
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN services s ON a.service_id = s.id
      JOIN personnel p ON a.personnel_id = p.id
      ORDER BY a.appointment_date DESC
    `;
    const [rows] = await pool.execute(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Error al obtener citas' }, { status: 500 });
  }
}
