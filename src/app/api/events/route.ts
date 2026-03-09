import { prisma } from '@/lib/prisma'
import { createEventSchema } from '@/lib/validations'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            include: { guests: true },
            orderBy: { date: 'asc' }
        })
        return NextResponse.json(events)
    } catch {
        return NextResponse.json(
            { error: 'Error al obtener eventos' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const parsed = createEventSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', issues: parsed.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const event = await prisma.event.create({
            data: {
                ...parsed.data,
                date: new Date(parsed.data.date),
            }
        })
        return NextResponse.json(event, { status: 201 })
    } catch {
        return NextResponse.json(
            { error: 'Error al crear evento' },
            { status: 500 }
        )
    }
}
