import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT ep.*, p.name as personnel_name 
      FROM employee_payments ep
      JOIN personnel p ON ep.personnel_id = p.id
      ORDER BY ep.payment_date DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching employee payments:', error);
    return NextResponse.json({ error: 'Error al obtener pagos a personal' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { personnelId, amount, type, notes } = await request.json();

    const [result] = await pool.execute(
      'INSERT INTO employee_payments (personnel_id, amount, payment_type, notes) VALUES (?, ?, ?, ?)',
      [personnelId, amount, type, notes || null]
    );

    return NextResponse.json({ success: true, id: (result as { insertId: number }).insertId });
  } catch (error) {
    console.error('Error creating employee payment:', error);
    return NextResponse.json({ error: 'Error al registrar pago a personal' }, { status: 500 });
  }
}
