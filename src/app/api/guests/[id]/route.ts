import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// PUT - Actualizar invitado
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params
        const id = parseInt(idString)
        const body = await request.json()
        const guest = await prisma.guest.update({
            where: { id },
            data: {
                name: body.name,
                origin: body.origin,
                companions: parseInt(String(body.companions)) || 0,
                confirmed: body.confirmed,
                relationship: body.relationship,
                notes: body.notes,
            }
        })

        // Actualizar asistentes del evento
        const event = await prisma.event.findUnique({ where: { id: guest.eventId }, include: { guests: true } })
        if (event) {
            const totalAttendees = event.guests.reduce((acc: number, curr: any) => acc + 1 + curr.companions, 0)
            await prisma.event.update({
                where: { id: guest.eventId },
                data: { currentAttendees: totalAttendees }
            })
        }

        return NextResponse.json(guest)
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al actualizar invitado' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar invitado
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params
        const id = parseInt(idString)
        // Obtener el evento antes de borrar para actualizar contadores
        const guest = await prisma.guest.findUnique({ where: { id } })

        if (!guest) {
            return NextResponse.json({ error: 'Invitado no encontrado' }, { status: 404 })
        }

        await prisma.guest.delete({
            where: { id }
        })

        // Actualizar asistentes del evento
        const event = await prisma.event.findUnique({ where: { id: guest.eventId }, include: { guests: true } })
        if (event) {
            const totalAttendees = event.guests.reduce((acc: number, curr: any) => acc + 1 + curr.companions, 0)
            await prisma.event.update({
                where: { id: guest.eventId },
                data: { currentAttendees: totalAttendees }
            })
        }

        return NextResponse.json({ message: 'Invitado eliminado' })
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al eliminar invitado' },
            { status: 500 }
        )
    }
}
