import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  phone: string | null;
  created_at: Date;
}

interface Admin {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: number, role: 'user' | 'admin'): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: number; role: 'user' | 'admin' } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; role: 'user' | 'admin' };
  } catch {
    return null;
  }
}

export async function createUser(email: string, password: string, name: string, phone?: string) {
  const hashedPassword = await hashPassword(password);
  const [result] = await pool.execute(
    'INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, name, phone || null]
  );
  return result;
}

export async function createAdmin(email: string, password: string, name: string) {
  const hashedPassword = await hashPassword(password);
  const [result] = await pool.execute(
    'INSERT INTO admins (email, password, name) VALUES (?, ?, ?)',
    [email, hashedPassword, name]
  );
  return result;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return (rows as User[])[0];
}

export async function getAdminByEmail(email: string): Promise<Admin | undefined> {
  const [rows] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);
  return (rows as Admin[])[0];
}

export async function getUserById(id: number): Promise<User | undefined> {
  const [rows] = await pool.execute('SELECT id, email, name, phone, created_at FROM users WHERE id = ?', [id]);
  return (rows as User[])[0];
}

export async function getAdminById(id: number): Promise<Admin | undefined> {
  const [rows] = await pool.execute('SELECT id, email, name, created_at FROM admins WHERE id = ?', [id]);
  return (rows as Admin[])[0];
}

export async function updateAdminPassword(id: number, password: string) {
  const hashedPassword = await hashPassword(password);
  await pool.execute('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, id]);
}

export async function updateUserPassword(id: number, password: string) {
  const hashedPassword = await hashPassword(password);
  await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
}
