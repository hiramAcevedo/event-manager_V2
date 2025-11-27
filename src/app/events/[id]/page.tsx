'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EventWithGuests } from '@/types'
import Badge from '@/components/Badge'
import DeleteButton from '@/components/DeleteButton'
import GuestTable from '@/components/GuestTable'
import { Calendar, MapPin, User, Users, ArrowLeft, Pencil, Monitor, Gift } from 'lucide-react'

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

    if (loading) {
        return (
            <div className="loading" style={{ minHeight: '50vh' }}>
                Cargando evento...
            </div>
        )
    }

    if (!event) return null

    const confirmedGuests = event.guests.filter(g => g.confirmed).length
    const totalPeople = event.guests.reduce((acc, curr) => acc + 1 + curr.companions, 0)
    const capacityPercentage = event.maxAttendees > 0
        ? Math.min(100, Math.round((totalPeople / event.maxAttendees) * 100))
        : 0

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Navegación */}
            <Link 
                href="/events" 
                style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                }}
            >
                <ArrowLeft size={16} />
                Volver a eventos
            </Link>

            {/* Header del Evento */}
            <div className="card">
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    gap: '1rem', 
                    marginBottom: '1.5rem' 
                }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <Badge variant="info">{event.eventType}</Badge>
                            {event.isVirtual && <Badge variant="info">Virtual</Badge>}
                            {event.isSurprise && <Badge variant="warning">Sorpresa</Badge>}
                        </div>
                        <h1 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.75rem' }}>
                            {event.title}
                        </h1>
                        {event.description && (
                            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {event.description}
                            </p>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                            href={`/events/${event.id}/edit`}
                            className="btn-ghost"
                            style={{ textDecoration: 'none' }}
                        >
                            <Pencil size={16} />
                            Editar
                        </Link>
                        <DeleteButton
                            onConfirm={handleDelete}
                            itemName="evento"
                        />
                    </div>
                </div>

                {/* Info del evento */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1.5rem',
                    padding: '1.5rem 0',
                    borderTop: '1px solid var(--border-primary)',
                    borderBottom: '1px solid var(--border-primary)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                            padding: '0.75rem', 
                            background: 'rgba(99, 102, 241, 0.1)', 
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--accent-primary)',
                        }}>
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Fecha
                            </p>
                            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>
                                {new Date(event.date).toLocaleDateString('es-MX', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                            padding: '0.75rem', 
                            background: 'rgba(16, 185, 129, 0.1)', 
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--accent-secondary)',
                        }}>
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Ubicación
                            </p>
                            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>
                                {event.location}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                            padding: '0.75rem', 
                            background: 'rgba(245, 158, 11, 0.1)', 
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--accent-warning)',
                        }}>
                            <User size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Organizador
                            </p>
                            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>
                                {event.organizer}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Barra de capacidad */}
                {event.maxAttendees > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Capacidad: {totalPeople} / {event.maxAttendees} personas
                            </span>
                            <span style={{ 
                                fontSize: '0.9rem', 
                                fontWeight: 600, 
                                color: capacityPercentage > 90 ? 'var(--accent-danger)' : 'var(--accent-primary)' 
                            }}>
                                {capacityPercentage}%
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className={`progress-bar-fill ${capacityPercentage > 90 ? 'danger' : ''}`}
                                style={{ width: `${capacityPercentage}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de Invitados */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={24} style={{ color: 'var(--accent-primary)' }} />
                    Lista de Invitados
                </h2>

                {/* Stats de invitados */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '1rem' 
                }}>
                    <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Invitaciones
                        </p>
                        <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {event.guests.length}
                        </p>
                    </div>
                    <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Confirmados
                        </p>
                        <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                            {confirmedGuests}
                        </p>
                    </div>
                    <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Total Personas
                        </p>
                        <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                            {totalPeople}
                        </p>
                    </div>
                </div>

                <GuestTable
                    guests={event.guests}
                    eventId={event.id}
                    onUpdate={fetchEvent}
                />
            </div>
        </div>
    )
}
