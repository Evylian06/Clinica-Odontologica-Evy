import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [completed] = await pool.execute(
      "SELECT COUNT(*) as count, SUM(s.price) as revenue FROM appointments a JOIN services s ON a.service_id = s.id WHERE a.status = 'completed'"
    );
    const [cancelled] = await pool.execute(
      "SELECT COUNT(*) as count FROM appointments WHERE status = 'cancelled'"
    );

    const completedData = completed as { count: number; revenue: number | null }[];
    const cancelledData = cancelled as { count: number }[];

    return NextResponse.json({
      totalRevenue: completedData[0].revenue || 0,
      completedAppointments: completedData[0].count,
      cancelledAppointments: cancelledData[0].count,
      averageRating: 0,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Error al obtener reportes' }, { status: 500 });
  }
}
