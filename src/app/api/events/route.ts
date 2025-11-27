import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Listar todos los eventos
export async function GET() {
    try {
        const events = await prisma.event.findMany({
            include: { guests: true },
            orderBy: { date: 'asc' }
        })
        return NextResponse.json(events)
    } catch (error) {
        console.error('Error fetching events:', error)
        return NextResponse.json(
            { error: 'Error al obtener eventos' },
            { status: 500 }
        )
    }
}

// POST - Crear evento
export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Creating event with body:', body)
        const event = await prisma.event.create({
            data: {
                title: body.title,
                description: body.description,
                date: new Date(body.date),
                location: body.location,
                organizer: body.organizer,
                eventType: body.eventType,
                maxAttendees: parseInt(String(body.maxAttendees)) || 0,
                isVirtual: body.isVirtual || false,
                isSurprise: body.isSurprise || false,
            }
        })
        return NextResponse.json(event, { status: 201 })
    } catch (error) {
        console.error('Error creating event:', error)
        return NextResponse.json(
            { error: 'Error al crear evento', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
