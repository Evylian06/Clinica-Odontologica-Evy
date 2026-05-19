import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { notifyAllAdmins } from '@/lib/push';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    const [rows] = userId 
      ? await pool.execute(`
          SELECT a.*, s.name as service_name, s.price, p.name as personnel_name, 
          (SELECT COUNT(*) FROM payments pay WHERE pay.appointment_id = a.id) as is_paid
          FROM appointments a 
          JOIN services s ON a.service_id = s.id 
          JOIN personnel p ON a.personnel_id = p.id 
          WHERE a.user_id = ? 
          ORDER BY a.appointment_date DESC
        `, [userId])
      : await pool.execute(`
          SELECT a.*, s.name as service_name, s.price, p.name as personnel_name,
          (SELECT COUNT(*) FROM payments pay WHERE pay.appointment_id = a.id) as is_paid
          FROM appointments a 
          JOIN services s ON a.service_id = s.id 
          JOIN personnel p ON a.personnel_id = p.id 
          ORDER BY a.appointment_date DESC
        `);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Error al obtener citas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, serviceId, personnelId, appointmentDate, notes } = await request.json();

    const [result] = await pool.execute(
      'INSERT INTO appointments (user_id, personnel_id, service_id, appointment_date, notes) VALUES (?, ?, ?, ?, ?)',
      [userId, personnelId, serviceId, appointmentDate, notes || null]
    );

    const appointmentId = (result as { insertId: number }).insertId;

    // Send notification to all admins about the new appointment
    await notifyAllAdmins(
      'Nueva Cita Creada',
      `Se ha creado una nueva cita #${appointmentId}.`,
      { type: 'appointment_created', appointmentId }
    );

    return NextResponse.json({ success: true, id: appointmentId });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Error al crear cita' }, { status: 500 });
  }
}
