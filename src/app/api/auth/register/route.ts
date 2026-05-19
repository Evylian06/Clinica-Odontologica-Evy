import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nombre, email y contraseña requeridos' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
    }

    // Create user
    await createUser(email, password, name, phone);

    // Get the created user
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
    }

    const token = generateToken(user.id, 'user');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      token,
      user: userWithoutPassword,
      role: 'user',
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Error al registrarse' }, { status: 500 });
  }
}
