import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET - Obtener evento por ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params
        const id = parseInt(idString)
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        const event = await prisma.event.findUnique({
            where: { id },
            include: { guests: true }
        })

        if (!event) {
            return NextResponse.json(
                { error: 'Evento no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json(event)
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener evento' },
            { status: 500 }
        )
    }
}

// PUT - Actualizar evento
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params
        const id = parseInt(idString)
        const body = await request.json()
        const event = await prisma.event.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                date: new Date(body.date),
                location: body.location,
                organizer: body.organizer,
                eventType: body.eventType,
                maxAttendees: parseInt(String(body.maxAttendees)) || 0,
                isVirtual: body.isVirtual,
                isSurprise: body.isSurprise,
            }
        })
        return NextResponse.json(event)
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al actualizar evento' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar evento
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params
        const id = parseInt(idString)
        await prisma.event.delete({
            where: { id }
        })
        return NextResponse.json({ message: 'Evento eliminado' })
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al eliminar evento' },
            { status: 500 }
        )
    }
}
