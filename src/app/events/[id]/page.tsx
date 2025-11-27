'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EventWithGuests } from '@/types'
import Badge from '@/components/Badge'
import DeleteButton from '@/components/DeleteButton'
import GuestTable from '@/components/GuestTable'

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [event, setEvent] = useState<EventWithGuests | null>(null)
    const [loading, setLoading] = useState(true)
    const [eventId, setEventId] = useState<string | null>(null)

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params
            setEventId(resolvedParams.id)
        }
        unwrapParams()
    }, [params])

    const fetchEvent = async () => {
        if (!eventId) return
        try {
            const res = await fetch(`/api/events/${eventId}`)
            if (!res.ok) {
                if (res.status === 404) router.push('/events')
                throw new Error('Error fetching event')
            }
            const data = await res.json()
            setEvent(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvent()
    }, [eventId])

    const handleDelete = async () => {
        if (!eventId) return
        try {
            await fetch(`/api/events/${eventId}`, { method: 'DELETE' })
            router.push('/events')
        } catch (error) {
            console.error('Error deleting event:', error)
        }
    }

    if (loading) return <div className="text-center py-10">Cargando...</div>
    if (!event) return null

    const confirmedGuests = event.guests.filter(g => g.confirmed).length
    const totalPeople = event.guests.reduce((acc, curr) => acc + 1 + curr.companions, 0)
    const capacityPercentage = event.maxAttendees > 0
        ? Math.min(100, Math.round((totalPeople / event.maxAttendees) * 100))
        : 0

    return (
        <div className="space-y-8">
            {/* Header del Evento */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div>
                        <div className="flex gap-2 mb-2">
                            <Badge variant="info">{event.eventType}</Badge>
                            {event.isVirtual && <Badge variant="info">Virtual</Badge>}
                            {event.isSurprise && <Badge variant="warning">Sorpresa</Badge>}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h1>
                        <p className="text-gray-600">{event.description}</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <Link
                            href={`/events/${event.id}/edit`}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium text-sm transition-colors"
                        >
                            Editar
                        </Link>
                        <DeleteButton
                            onConfirm={handleDelete}
                            itemName="evento"
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-md font-medium text-sm transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📅</span>
                        <div>
                            <p className="text-sm text-gray-500">Fecha</p>
                            <p className="font-medium">
                                {new Date(event.date).toLocaleDateString('es-MX', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📍</span>
                        <div>
                            <p className="text-sm text-gray-500">Ubicación</p>
                            <p className="font-medium">{event.location}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">👤</span>
                        <div>
                            <p className="text-sm text-gray-500">Organizador</p>
                            <p className="font-medium">{event.organizer}</p>
                        </div>
                    </div>
                </div>

                {event.maxAttendees > 0 && (
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Capacidad: {totalPeople} / {event.maxAttendees} personas</span>
                            <span className="font-medium text-blue-600">{capacityPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${capacityPercentage > 90 ? 'bg-red-500' : 'bg-blue-600'}`}
                                style={{ width: `${capacityPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de Invitados */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Lista de Invitados</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500">Total Invitaciones</p>
                        <p className="text-2xl font-bold text-gray-800">{event.guests.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500">Confirmados</p>
                        <p className="text-2xl font-bold text-green-600">{confirmedGuests}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500">Total Personas</p>
                        <p className="text-2xl font-bold text-blue-600">{totalPeople}</p>
                    </div>
                </div>

                <GuestTable
                    guests={event.guests}
                    eventId={event.id}
                    onUpdate={fetchEvent}
                />
            </div>

            <div className="pt-4">
                <Link href="/events" className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1">
                    ← Volver a la lista
                </Link>
            </div>
        </div>
    )
}
