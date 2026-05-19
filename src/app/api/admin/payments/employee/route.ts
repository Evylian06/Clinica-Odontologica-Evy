import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT ep.*, p.name as personnel_name
      FROM employee_payments ep
      JOIN personnel p ON ep.personnel_id = p.id
      ORDER BY ep.payment_date DESC
    `;
    const [rows] = await pool.execute(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching employee payments:', error);
    return NextResponse.json({ error: 'Error al obtener pagos a empleados' }, { status: 500 });
  }
}
