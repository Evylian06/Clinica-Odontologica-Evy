import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { notifyUser, notifyAllAdmins } from '@/lib/push';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { status, appointment_date, notes, service_id, personnel_id } = await request.json();
    const { id } = await params;

    console.log('Updating appointment:', { id, status, appointment_date, notes, service_id, personnel_id });

    // Get current appointment data to check status change
    const [currentAppointment] = await pool.execute(
      'SELECT user_id, status FROM appointments WHERE id = ?',
      [id]
    ) as [Record<string, unknown>[], unknown];

    if (!currentAppointment || currentAppointment.length === 0) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
    }

    const appointment = currentAppointment[0] as { user_id: number; status: string };
    const previousStatus = appointment.status;

    // Build dynamic query based on provided fields
    let query = 'UPDATE appointments SET ';
    const values = [];
    const fields = [];

    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    if (appointment_date !== undefined) { fields.push('appointment_date = ?'); values.push(appointment_date); }
    if (notes !== undefined) { fields.push('notes = ?'); values.push(notes); }
    if (service_id !== undefined) { fields.push('service_id = ?'); values.push(service_id); }
    if (personnel_id !== undefined) { fields.push('personnel_id = ?'); values.push(personnel_id); }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron campos para actualizar' }, { status: 400 });
    }

    query += fields.join(', ') + ' WHERE id = ?';
    values.push(id);

    console.log('Executing query:', query, 'with values:', values);

    await pool.execute(query, values);

    // Send notification to user if status changed to confirmed
    if (status === 'confirmed' && previousStatus !== 'confirmed') {
      await notifyUser(
        appointment.user_id,
        '¡Cita Confirmada!',
        'Tu cita ha sido confirmada exitosamente.',
        { type: 'appointment_confirmed', appointmentId: parseInt(id) }
      );
    }

    // Send notification to all admins about the appointment update
    await notifyAllAdmins(
      'Cita Actualizada',
      `La cita #${id} ha sido actualizada.`,
      { type: 'appointment_updated', appointmentId: parseInt(id) }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Error al actualizar cita' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // First delete related payments
    await pool.execute('DELETE FROM payments WHERE appointment_id = ?', [id]);
    
    // Then delete appointment
    await pool.execute('DELETE FROM appointments WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: 'Error al eliminar cita' }, { status: 500 });
  }
}
