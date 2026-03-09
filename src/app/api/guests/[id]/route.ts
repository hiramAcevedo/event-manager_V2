import { prisma } from '@/lib/prisma'
import { updateGuestSchema, idParamSchema } from '@/lib/validations'
import { NextResponse } from 'next/server'

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params
        const idResult = idParamSchema.safeParse(idString)
        if (!idResult.success) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        const body = await request.json()
        const parsed = updateGuestSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', issues: parsed.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const guest = await prisma.guest.update({
            where: { id: idResult.data },
            data: parsed.data
        })

        const event = await prisma.event.findUnique({
            where: { id: guest.eventId },
            include: { guests: true }
        })
        if (event) {
            const totalAttendees = event.guests.reduce((acc, curr) => acc + 1 + curr.companions, 0)
            await prisma.event.update({
                where: { id: guest.eventId },
                data: { currentAttendees: totalAttendees }
            })
        }

        return NextResponse.json(guest)
    } catch {
        return NextResponse.json(
            { error: 'Error al actualizar invitado' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params
        const idResult = idParamSchema.safeParse(idString)
        if (!idResult.success) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        const guest = await prisma.guest.findUnique({
            where: { id: idResult.data }
        })
        if (!guest) {
            return NextResponse.json({ error: 'Invitado no encontrado' }, { status: 404 })
        }

        await prisma.guest.delete({
            where: { id: idResult.data }
        })

        const event = await prisma.event.findUnique({
            where: { id: guest.eventId },
            include: { guests: true }
        })
        if (event) {
            const totalAttendees = event.guests.reduce((acc, curr) => acc + 1 + curr.companions, 0)
            await prisma.event.update({
                where: { id: guest.eventId },
                data: { currentAttendees: totalAttendees }
            })
        }

        return NextResponse.json({ message: 'Invitado eliminado' })
    } catch {
        return NextResponse.json(
            { error: 'Error al eliminar invitado' },
            { status: 500 }
        )
    }
}
