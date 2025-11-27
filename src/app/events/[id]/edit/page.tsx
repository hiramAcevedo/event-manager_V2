'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import EventForm from '@/components/EventForm'
import { Event, EventFormData } from '@/types'
import { ArrowLeft } from 'lucide-react'

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

    if (loading) {
        return (
            <div className="loading" style={{ minHeight: '50vh' }}>
                Cargando evento...
            </div>
        )
    }

    if (!event) return null

    return (
        <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Link 
                href={`/events/${eventId}`}
                style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    marginBottom: '1rem',
                }}
            >
                <ArrowLeft size={16} />
                Volver al evento
            </Link>

            <EventForm
                event={event}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
            />
        </div>
    )
}
