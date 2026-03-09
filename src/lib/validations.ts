import { z } from 'zod'

const EventTypeEnum = z.enum([
    'BODA', 'CUMPLEANOS', 'XV_ANOS', 'CORPORATIVO', 'CONFERENCIA',
    'BAUTIZO', 'ANIVERSARIO', 'GRADUACION', 'BABY_SHOWER', 'OTRO'
])

export const createEventSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(2000).nullable().optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Fecha inválida',
    }),
    location: z.string().min(1).max(300),
    organizer: z.string().min(1).max(150),
    eventType: EventTypeEnum.default('OTRO'),
    maxAttendees: z.coerce.number().int().min(0).default(0),
    isVirtual: z.boolean().default(false),
    isSurprise: z.boolean().default(false),
})

export const updateEventSchema = createEventSchema

export const createGuestSchema = z.object({
    name: z.string().min(1).max(200),
    origin: z.string().max(200).nullable().optional(),
    companions: z.coerce.number().int().min(0).max(50).default(0),
    confirmed: z.boolean().default(false),
    relationship: z.string().max(100).nullable().optional(),
    notes: z.string().max(1000).nullable().optional(),
    eventId: z.coerce.number().int().positive(),
})

export const updateGuestSchema = createGuestSchema.omit({ eventId: true })

export const idParamSchema = z.coerce.number().int().positive()
