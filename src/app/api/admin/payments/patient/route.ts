import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT p.*, u.name as user_name, s.name as service_name
      FROM payments p
      JOIN users u ON p.user_id = u.id
      JOIN appointments a ON p.appointment_id = a.id
      JOIN services s ON a.service_id = s.id
      ORDER BY p.payment_date DESC
    `;
    const [rows] = await pool.execute(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching patient payments:', error);
    return NextResponse.json({ error: 'Error al obtener pagos de pacientes' }, { status: 500 });
  }
}
