import { NextRequest, NextResponse } from 'next/server';
import { savePushToken } from '@/lib/push';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { subscription, userId } = await request.json();

    if (!subscription || !userId) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Verify user exists
    const [user] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    ) as [Record<string, unknown>[], unknown];

    if (user.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Save push token
    await savePushToken(userId, null, subscription);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error registering push token:', error);
    return NextResponse.json({ error: 'Error al registrar token de notificación' }, { status: 500 });
  }
}
