import Link from 'next/link'
import { Event } from '@/types'
import Badge from './Badge'
import DeleteButton from './DeleteButton'
import { Calendar, MapPin, Pencil, ArrowRight, User } from 'lucide-react'

interface EventCardProps {
    event: Event & { guests?: any[] };
    onDelete: (id: number) => Promise<void>;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
    const date = new Date(event.date).toLocaleDateString('es-MX', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    return (
        <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header de la tarjeta */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <h3 style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 700, 
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3,
                    }}>
                        {event.title}
                    </h3>
                    <Badge variant="info">{event.eventType}</Badge>
                </div>
                
                {/* Fecha */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Calendar size={14} />
                    <span style={{ textTransform: 'capitalize' }}>{date}</span>
                </div>
            </div>

            {/* Info del evento */}
            <div style={{ flex: 1, marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <MapPin size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                    }}>
                        {event.location}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <User size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                    }}>
                        {event.organizer}
                    </span>
                </div>

                {/* Badges de estado */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                    {event.isVirtual && <Badge variant="info">Virtual</Badge>}
                    {event.isSurprise && <Badge variant="warning">Sorpresa</Badge>}
                    {!event.isVirtual && !event.isSurprise && <Badge variant="success">Presencial</Badge>}
                </div>
            </div>

            {/* Footer con acciones */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingTop: '1rem', 
                borderTop: '1px solid var(--border-primary)',
                marginTop: 'auto' 
            }}>
                <Link
                    href={`/events/${event.id}`}
                    style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        color: 'var(--accent-primary)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                    }}
                >
                    Ver detalles
                    <ArrowRight size={16} />
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link
                        href={`/events/${event.id}/edit`}
                        style={{
                            padding: '0.5rem',
                            background: 'rgba(245, 158, 11, 0.1)',
                            color: '#fbbf24',
                            borderRadius: 'var(--radius-md)',
                            display: 'inline-flex',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                        }}
                        title="Editar"
                    >
                        <Pencil size={16} />
                    </Link>
                    <DeleteButton
                        onConfirm={() => onDelete(event.id)}
                        itemName="evento"
                        iconOnly
                    />
                </div>
            </div>
        </div>
    )
}
