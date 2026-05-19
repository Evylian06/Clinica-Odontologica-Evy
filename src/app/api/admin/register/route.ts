import { NextRequest, NextResponse } from 'next/server';
import { createAdmin, getAdminByEmail } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nombre, email y contraseña requeridos' }, { status: 400 });
    }

    // Note: We'll allow multiple admins now as requested by the user.
    // However, in a real scenario, this should be protected so only authorized persons can reach this.

    // Check if email is already registered
    const existingAdmin = await getAdminByEmail(email);
    if (existingAdmin) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
    }

    // Create admin
    await createAdmin(email, password, name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Register admin error:', error);
    return NextResponse.json({ error: 'Error al registrar administrador' }, { status: 500 });
  }
}
