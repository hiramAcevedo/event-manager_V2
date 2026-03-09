import { prisma } from '@/lib/prisma'
import { updateEventSchema, idParamSchema } from '@/lib/validations'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params
        const result = idParamSchema.safeParse(idString)
        if (!result.success) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        const event = await prisma.event.findUnique({
            where: { id: result.data },
            include: { guests: true }
        })

        if (!event) {
            return NextResponse.json(
                { error: 'Evento no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json(event)
    } catch {
        return NextResponse.json(
            { error: 'Error al obtener evento' },
            { status: 500 }
        )
    }
}

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
        const parsed = updateEventSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', issues: parsed.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const event = await prisma.event.update({
            where: { id: idResult.data },
            data: {
                ...parsed.data,
                date: new Date(parsed.data.date),
            }
        })
        return NextResponse.json(event)
    } catch {
        return NextResponse.json(
            { error: 'Error al actualizar evento' },
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
        const result = idParamSchema.safeParse(idString)
        if (!result.success) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        await prisma.event.delete({
            where: { id: result.data }
        })
        return NextResponse.json({ message: 'Evento eliminado' })
    } catch {
        return NextResponse.json(
            { error: 'Error al eliminar evento' },
            { status: 500 }
        )
    }
}
