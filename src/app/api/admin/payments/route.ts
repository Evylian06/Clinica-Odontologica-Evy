import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, u.name as user_name, s.name as service_name 
      FROM payments p
      JOIN users u ON p.user_id = u.id
      JOIN appointments a ON p.appointment_id = a.id
      JOIN services s ON a.service_id = s.id
      ORDER BY p.payment_date DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Error al obtener pagos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { appointmentId, userId, amount, method, notes } = await request.json();

    const [result] = await pool.execute(
      'INSERT INTO payments (appointment_id, user_id, amount, payment_method, notes) VALUES (?, ?, ?, ?, ?)',
      [appointmentId, userId, amount, method, notes || null]
    );

    // Also update appointment status if needed
    await pool.execute(
      "UPDATE appointments SET status = 'completed' WHERE id = ?",
      [appointmentId]
    );

    return NextResponse.json({ success: true, id: (result as { insertId: number }).insertId });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Error al registrar pago' }, { status: 500 });
  }
}
