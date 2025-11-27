// Re-defined manually to avoid importing @prisma/client in client components

export enum EventType {
    BODA = 'BODA',
    CUMPLEANOS = 'CUMPLEANOS',
    XV_ANOS = 'XV_ANOS',
    CORPORATIVO = 'CORPORATIVO',
    CONFERENCIA = 'CONFERENCIA',
    BAUTIZO = 'BAUTIZO',
    ANIVERSARIO = 'ANIVERSARIO',
    GRADUACION = 'GRADUACION',
    BABY_SHOWER = 'BABY_SHOWER',
    OTRO = 'OTRO'
}

export interface Event {
    id: number;
    title: string;
    description: string | null;
    date: Date;
    location: string;
    organizer: string;
    eventType: EventType;
    maxAttendees: number;
    currentAttendees: number;
    isVirtual: boolean;
    isSurprise: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Guest {
    id: number;
    name: string;
    origin: string | null;
    companions: number;
    confirmed: boolean;
    relationship: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    eventId: number;
}

export interface EventFormData {
    title: string;
    description?: string;
    date: string; // ISO string for form handling
    location: string;
    organizer: string;
    eventType: EventType;
    maxAttendees: number;
    isVirtual: boolean;
    isSurprise: boolean;
}

export interface GuestFormData {
    name: string;
    origin?: string;
    companions: number;
    confirmed: boolean;
    relationship?: string;
    notes?: string;
}

export type EventWithGuests = Event & {
    guests: Guest[]
}
