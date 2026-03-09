import { prisma } from '@/lib/prisma'
import { createGuestSchema } from '@/lib/validations'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const parsed = createGuestSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', issues: parsed.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const eventExists = await prisma.event.findUnique({
            where: { id: parsed.data.eventId }
        })
        if (!eventExists) {
            return NextResponse.json(
                { error: 'El evento especificado no existe' },
                { status: 404 }
            )
        }

        const guest = await prisma.guest.create({
            data: parsed.data
        })

        const event = await prisma.event.findUnique({
            where: { id: parsed.data.eventId },
            include: { guests: true }
        })
        if (event) {
            const totalAttendees = event.guests.reduce((acc, curr) => acc + 1 + curr.companions, 0)
            await prisma.event.update({
                where: { id: parsed.data.eventId },
                data: { currentAttendees: totalAttendees }
            })
        }

        return NextResponse.json(guest, { status: 201 })
    } catch {
        return NextResponse.json(
            { error: 'Error al crear invitado' },
            { status: 500 }
        )
    }
}
