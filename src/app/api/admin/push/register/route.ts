import { NextRequest, NextResponse } from 'next/server';
import { savePushToken } from '@/lib/push';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { subscription, adminId } = await request.json();

    if (!subscription || !adminId) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Verify admin exists
    const [admin] = await pool.execute(
      'SELECT id FROM admins WHERE id = ?',
      [adminId]
    ) as [Record<string, unknown>[], unknown];

    if (admin.length === 0) {
      return NextResponse.json({ error: 'Admin no encontrado' }, { status: 404 });
    }

    // Save push token
    await savePushToken(null, adminId, subscription);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error registering admin push token:', error);
    return NextResponse.json({ error: 'Error al registrar token de notificación' }, { status: 500 });
  }
}
