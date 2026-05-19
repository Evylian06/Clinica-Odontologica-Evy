import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { available } = await request.json();
    const { id } = await params;

    await pool.execute(
      'UPDATE personnel SET available = ? WHERE id = ?',
      [available, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating personnel:', error);
    return NextResponse.json({ error: 'Error al actualizar personal' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await pool.execute('DELETE FROM appointments WHERE personnel_id = ?', [id]);
    await pool.execute('DELETE FROM personnel WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting personnel:', error);
    return NextResponse.json({ error: 'Error al eliminar personal' }, { status: 500 });
  }
}
