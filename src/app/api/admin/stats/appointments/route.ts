import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [total] = await pool.execute('SELECT COUNT(*) as count FROM appointments');
    const [pending] = await pool.execute("SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'");
    const [today] = await pool.execute(
      "SELECT COUNT(*) as count FROM appointments WHERE DATE(appointment_date) = CURDATE()"
    );

    return NextResponse.json({
      total: (total as { count: number }[])[0].count,
      pending: (pending as { count: number }[])[0].count,
      today: (today as { count: number }[])[0].count,
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
