import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getAdminByEmail, verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    // Try user login first
    const user = await getUserByEmail(email);
    if (user) {
      const isValid = await verifyPassword(password, user.password);
      if (isValid) {
        const token = generateToken(user.id, 'user');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return NextResponse.json({
          token,
          user: userWithoutPassword,
          role: 'user',
        });
      }
    }

    // Try admin login
    const admin = await getAdminByEmail(email);
    if (admin) {
      const isValid = await verifyPassword(password, admin.password);
      if (isValid) {
        const token = generateToken(admin.id, 'admin');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...adminWithoutPassword } = admin;
        return NextResponse.json({
          token,
          user: adminWithoutPassword,
          role: 'admin',
        });
      }
    }

    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}
