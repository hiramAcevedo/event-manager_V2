'use client'

import { useState } from 'react'
import { Event, EventFormData, EventType } from '@/types'
import { Save, X, Calendar, MapPin, User, Users, FileText, Settings, Monitor, Gift } from 'lucide-react'

interface EventFormProps {
    event?: Event;
    onSubmit: (data: EventFormData) => Promise<void>;
    onCancel: () => void;
}

export default function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<EventFormData>({
        title: event?.title || '',
        description: event?.description || '',
        date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
        location: event?.location || '',
        organizer: event?.organizer || '',
        eventType: event?.eventType || EventType.OTRO,
        maxAttendees: event?.maxAttendees || 0,
        isVirtual: event?.isVirtual || false,
        isSurprise: event?.isSurprise || false,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSubmit(formData)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }))
    }

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        paddingLeft: '2.75rem',
        fontSize: '0.95rem',
        color: 'var(--text-primary)',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-md)',
    }

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: '0.5rem',
    }

    return (
        <form onSubmit={handleSubmit} className="card fade-in">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={24} style={{ color: 'var(--accent-primary)' }} />
                {event ? 'Editar Evento' : 'Nuevo Evento'}
            </h2>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '1.25rem', 
                marginBottom: '1.5rem' 
            }}>
                {/* Título */}
                <div>
                    <label style={labelStyle}>Título del Evento *</label>
                    <div style={{ position: 'relative' }}>
                        <FileText size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="Nombre del evento"
                            value={formData.title}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Tipo de Evento */}
                <div>
                    <label style={labelStyle}>Tipo de Evento *</label>
                    <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        style={{ ...inputStyle, paddingLeft: '1rem' }}
                    >
                        {Object.values(EventType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Fecha */}
                <div>
                    <label style={labelStyle}>Fecha *</label>
                    <div style={{ position: 'relative' }}>
                        <Calendar size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Ubicación */}
                <div>
                    <label style={labelStyle}>Ubicación *</label>
                    <div style={{ position: 'relative' }}>
                        <MapPin size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            name="location"
                            required
                            placeholder="Lugar del evento"
                            value={formData.location}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Organizador */}
                <div>
                    <label style={labelStyle}>Organizador *</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            name="organizer"
                            required
                            placeholder="Nombre del organizador"
                            value={formData.organizer}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Capacidad Máxima */}
                <div>
                    <label style={labelStyle}>Capacidad Máxima</label>
                    <div style={{ position: 'relative' }}>
                        <Users size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="number"
                            name="maxAttendees"
                            min="0"
                            placeholder="0 = Sin límite"
                            value={formData.maxAttendees}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                </div>
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Descripción</label>
                <textarea
                    name="description"
                    rows={3}
                    placeholder="Describe tu evento..."
                    value={formData.description}
                    onChange={handleChange}
                    style={{ 
                        ...inputStyle, 
                        paddingLeft: '1rem',
                        resize: 'vertical',
                        minHeight: '100px',
                    }}
                />
            </div>

            {/* Checkboxes */}
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '1rem', 
                marginBottom: '1.5rem',
            }}>
                <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '1rem',
                    background: formData.isVirtual ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-primary)',
                    border: `1px solid ${formData.isVirtual ? 'rgba(99, 102, 241, 0.3)' : 'var(--border-primary)'}`,
                    borderRadius: 'var(--radius-md)',
                    flex: '1 1 200px',
                }}>
                    <input
                        type="checkbox"
                        name="isVirtual"
                        checked={formData.isVirtual}
                        onChange={handleChange}
                        style={{ 
                            width: '1.25rem', 
                            height: '1.25rem',
                            cursor: 'pointer',
                        }}
                    />
                    <Monitor size={18} style={{ color: formData.isVirtual ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                    <span style={{ fontWeight: 500 }}>Evento Virtual</span>
                </label>

                <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '1rem',
                    background: formData.isSurprise ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-primary)',
                    border: `1px solid ${formData.isSurprise ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-primary)'}`,
                    borderRadius: 'var(--radius-md)',
                    flex: '1 1 200px',
                }}>
                    <input
                        type="checkbox"
                        name="isSurprise"
                        checked={formData.isSurprise}
                        onChange={handleChange}
                        style={{ 
                            width: '1.25rem', 
                            height: '1.25rem',
                            cursor: 'pointer',
                        }}
                    />
                    <Gift size={18} style={{ color: formData.isSurprise ? 'var(--accent-warning)' : 'var(--text-muted)' }} />
                    <span style={{ fontWeight: 500 }}>Evento Sorpresa</span>
                </label>
            </div>

            {/* Botones de acción */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '0.75rem', 
                paddingTop: '1.25rem', 
                borderTop: '1px solid var(--border-primary)' 
            }}>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-ghost"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <X size={18} />
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Save size={18} />
                    {loading ? 'Guardando...' : 'Guardar Evento'}
                </button>
            </div>
        </form>
    )
}
