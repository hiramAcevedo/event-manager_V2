'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import EventCard from '@/components/EventCard'
import { Event } from '@/types'
import { LayoutGrid, List, Plus, Eye, Pencil, MapPin, Calendar, User, Sparkles } from 'lucide-react'
import Badge from '@/components/Badge'
import DeleteButton from '@/components/DeleteButton'

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // Cargar preferencia de vista guardada
    useEffect(() => {
        const savedViewMode = localStorage.getItem('event-manager-view-mode') as 'grid' | 'list' | null
        if (savedViewMode) {
            setViewMode(savedViewMode)
        }
    }, [])

    // Guardar preferencia de vista
    const handleViewModeChange = (mode: 'grid' | 'list') => {
        setViewMode(mode)
        localStorage.setItem('event-manager-view-mode', mode)
    }

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events', { cache: 'no-store' })
            if (!res.ok) throw new Error('Error fetching events')
            const data = await res.json()
            setEvents(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleDelete = async (id: number) => {
        try {
            await fetch(`/api/events/${id}`, { method: 'DELETE' })
            setEvents(events.filter(e => e.id !== id))
        } catch (error) {
            console.error('Error deleting event:', error)
        }
    }

    if (loading) {
        return (
            <div className="loading" style={{ minHeight: '50vh' }}>
                Cargando eventos...
            </div>
        )
    }

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header de la página */}
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                justifyContent: 'space-between', 
                alignItems: 'center', 
                gap: '1rem',
            }}>
                <div>
                    <h1 style={{ margin: 0, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={28} style={{ color: 'var(--accent-primary)' }} />
                        Mis Eventos
                    </h1>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {events.length} evento{events.length !== 1 ? 's' : ''} registrado{events.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Toggle de vista */}
                    <div style={{
                        display: 'flex',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.25rem',
                    }}>
                        <button
                            onClick={() => handleViewModeChange('grid')}
                            style={{
                                padding: '0.5rem 0.75rem',
                                background: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
                                color: viewMode === 'grid' ? 'white' : 'var(--text-muted)',
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            title="Vista de cuadrícula"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => handleViewModeChange('list')}
                            style={{
                                padding: '0.5rem 0.75rem',
                                background: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent',
                                color: viewMode === 'list' ? 'white' : 'var(--text-muted)',
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            title="Vista de lista"
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <Link
                        href="/events/new"
                        className="btn-secondary"
                        style={{ textDecoration: 'none' }}
                    >
                        <Plus size={18} />
                        <span>Nuevo Evento</span>
                    </Link>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">
                        <Sparkles size={48} />
                    </div>
                    <h3 className="empty-state-title">No hay eventos aún</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Crea tu primer evento para comenzar a gestionar tus celebraciones
                    </p>
                    <Link
                        href="/events/new"
                        className="btn-primary"
                        style={{ textDecoration: 'none' }}
                    >
                        <Plus size={18} />
                        Crear mi primer evento
                    </Link>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="events-grid">
                            {events.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="table-container">
                            <div className="table-scroll">
                                <table style={{ minWidth: '800px' }}>
                                    <thead>
                                        <tr>
                                            <th>Evento</th>
                                            <th>Fecha</th>
                                            <th>Ubicación</th>
                                            <th>Organizador</th>
                                            <th>Tipo</th>
                                            <th>Modalidad</th>
                                            <th style={{ textAlign: 'center' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map(event => (
                                            <tr key={event.id}>
                                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {event.title}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                                                        {new Date(event.date).toLocaleDateString('es-MX', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                                                        <span style={{ 
                                                            maxWidth: '150px', 
                                                            overflow: 'hidden', 
                                                            textOverflow: 'ellipsis', 
                                                            whiteSpace: 'nowrap' 
                                                        }}>
                                                            {event.location}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <User size={14} style={{ color: 'var(--text-muted)' }} />
                                                        {event.organizer}
                                                    </div>
                                                </td>
                                                <td>
                                                    <Badge variant="info">{event.eventType}</Badge>
                                                </td>
                                                <td>
                                                    <Badge variant={event.isVirtual ? 'info' : 'success'}>
                                                        {event.isVirtual ? 'Virtual' : 'Presencial'}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                        <Link
                                                            href={`/events/${event.id}`}
                                                            style={{
                                                                padding: '0.5rem',
                                                                background: 'rgba(99, 102, 241, 0.1)',
                                                                color: 'var(--accent-primary)',
                                                                borderRadius: 'var(--radius-sm)',
                                                                display: 'inline-flex',
                                                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                                            }}
                                                            title="Ver detalles"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>
                                                        <Link
                                                            href={`/events/${event.id}/edit`}
                                                            style={{
                                                                padding: '0.5rem',
                                                                background: 'rgba(245, 158, 11, 0.1)',
                                                                color: '#fbbf24',
                                                                borderRadius: 'var(--radius-sm)',
                                                                display: 'inline-flex',
                                                                border: '1px solid rgba(245, 158, 11, 0.2)',
                                                            }}
                                                            title="Editar"
                                                        >
                                                            <Pencil size={16} />
                                                        </Link>
                                                        <DeleteButton
                                                            onConfirm={() => handleDelete(event.id)}
                                                            itemName="evento"
                                                            iconOnly
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
