import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [total] = await pool.execute('SELECT COUNT(*) as count FROM personnel');
    return NextResponse.json({ total: (total as { count: number }[])[0].count });
  } catch (error) {
    console.error('Error fetching personnel stats:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
