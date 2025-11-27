'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import EventForm from '@/components/EventForm'
import { Event, EventFormData } from '@/types'

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [event, setEvent] = useState<Event | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [eventId, setEventId] = useState<string | null>(null)

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params
            setEventId(resolvedParams.id)
        }
        unwrapParams()
    }, [params])

    useEffect(() => {
        if (!eventId) return
        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${eventId}`)
                if (!res.ok) throw new Error('Error fetching event')
                const data = await res.json()
                setEvent(data)
            } catch (error) {
                console.error(error)
                router.push('/events')
            } finally {
                setLoading(false)
            }
        }
        fetchEvent()
    }, [eventId, router])

    const handleSubmit = async (data: EventFormData) => {
        if (!eventId) return
        const res = await fetch(`/api/events/${eventId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            throw new Error('Error updating event')
        }

        router.push(`/events/${eventId}`)
        router.refresh()
    }

    if (loading) return <div className="text-center py-10">Cargando...</div>
    if (!event) return null

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Evento</h1>
            <EventForm
                event={event}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
            />
        </div>
    )
}
