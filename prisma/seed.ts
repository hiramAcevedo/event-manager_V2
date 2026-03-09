import { PrismaClient, EventType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    const boda = await prisma.event.create({
        data: {
            title: 'Boda de Ana y Carlos',
            description: 'Celebración de la boda en el Jardín Real con recepción y cena.',
            date: new Date('2026-06-15T17:00:00'),
            location: 'Jardín Real, Guadalajara, Jalisco',
            organizer: 'María López',
            eventType: EventType.BODA,
            maxAttendees: 150,
            isVirtual: false,
            isSurprise: false,
            guests: {
                create: [
                    { name: 'Roberto García', origin: 'CDMX', companions: 1, confirmed: true, relationship: 'Familia' },
                    { name: 'Laura Martínez', origin: 'Monterrey', companions: 2, confirmed: true, relationship: 'Amiga' },
                    { name: 'Pedro Sánchez', origin: 'Guadalajara', companions: 0, confirmed: false, relationship: 'Compañero de trabajo' },
                    { name: 'Sofía Hernández', origin: 'Querétaro', companions: 1, confirmed: true, relationship: 'Prima' },
                    { name: 'Diego Torres', origin: 'Guadalajara', companions: 3, confirmed: false, relationship: 'Amigo', notes: 'Viene con su familia' },
                ]
            }
        }
    })

    const cumple = await prisma.event.create({
        data: {
            title: 'Cumpleaños sorpresa de Valentina',
            description: 'Fiesta sorpresa de 30 años. Tema: años 80.',
            date: new Date('2026-04-20T19:00:00'),
            location: 'Salón Fiesta, Monterrey, NL',
            organizer: 'Hiram Acevedo',
            eventType: EventType.CUMPLEANOS,
            maxAttendees: 40,
            isVirtual: false,
            isSurprise: true,
            guests: {
                create: [
                    { name: 'Camila Ruiz', origin: 'Monterrey', companions: 0, confirmed: true, relationship: 'Mejor amiga' },
                    { name: 'Andrés Vega', origin: 'Saltillo', companions: 1, confirmed: true, relationship: 'Hermano' },
                    { name: 'Fernanda Díaz', origin: 'Monterrey', companions: 0, confirmed: false, relationship: 'Compañera de universidad' },
                ]
            }
        }
    })

    const conferencia = await prisma.event.create({
        data: {
            title: 'Tech Conference 2026',
            description: 'Conferencia sobre Cloud Computing, IA y desarrollo full-stack.',
            date: new Date('2026-09-10T09:00:00'),
            location: 'Centro de Convenciones, CDMX',
            organizer: 'TechMX Org',
            eventType: EventType.CONFERENCIA,
            maxAttendees: 500,
            isVirtual: true,
            isSurprise: false,
            guests: {
                create: [
                    { name: 'Ricardo Flores', origin: 'CDMX', companions: 0, confirmed: true, relationship: 'Ponente', notes: 'Talk: Serverless con Vercel' },
                    { name: 'Elena Castro', origin: 'Puebla', companions: 0, confirmed: true, relationship: 'Asistente' },
                    { name: 'Miguel Ángel Reyes', origin: 'Guadalajara', companions: 1, confirmed: false, relationship: 'Sponsor' },
                ]
            }
        }
    })

    for (const event of [boda, cumple, conferencia]) {
        const guests = await prisma.guest.findMany({ where: { eventId: event.id } })
        const total = guests.reduce((acc, g) => acc + 1 + g.companions, 0)
        await prisma.event.update({
            where: { id: event.id },
            data: { currentAttendees: total }
        })
    }

    console.log(`Seed complete: ${boda.title}, ${cumple.title}, ${conferencia.title}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
