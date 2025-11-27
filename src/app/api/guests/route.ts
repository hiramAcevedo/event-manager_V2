import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// POST - Crear invitado
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const guest = await prisma.guest.create({
            data: {
                name: body.name,
                origin: body.origin,
                companions: parseInt(String(body.companions)) || 0,
                confirmed: body.confirmed || false,
                relationship: body.relationship,
                notes: body.notes,
                eventId: parseInt(String(body.eventId))
            }
        })

        // Actualizar contador de asistentes en el evento
        // Esto podría ser un trigger o calculado, pero lo haremos simple aquí
        // O mejor aún, el contador currentAttendees se puede calcular al vuelo o actualizarse aquí
        // Vamos a actualizarlo aquí para mantener consistencia con el modelo
        const event = await prisma.event.findUnique({ where: { id: body.eventId }, include: { guests: true } })
        if (event) {
            const totalAttendees = event.guests.reduce((acc: number, curr: any) => acc + 1 + curr.companions, 0)
            await prisma.event.update({
                where: { id: body.eventId },
                data: { currentAttendees: totalAttendees }
            })
        }

        return NextResponse.json(guest, { status: 201 })
    } catch (error) {
        console.error('Error creating guest:', error)
        return NextResponse.json(
            { error: 'Error al crear invitado', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
