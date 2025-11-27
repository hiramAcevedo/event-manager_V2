'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Event, EventFormData, EventType } from '@/types'

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

    return (
        <form onSubmit={handleSubmit} className="card fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                    <label>Título *</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label>Tipo de Evento *</label>
                    <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    >
                        {Object.values(EventType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Fecha *</label>
                    <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label>Ubicación *</label>
                    <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label>Organizador *</label>
                    <input
                        type="text"
                        name="organizer"
                        required
                        value={formData.organizer}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label>Capacidad Máxima</label>
                    <input
                        type="number"
                        name="maxAttendees"
                        min="0"
                        value={formData.maxAttendees}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label>Descripción</label>
                <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        name="isVirtual"
                        checked={formData.isVirtual}
                        onChange={handleChange}
                        style={{ width: 'auto', margin: 0 }}
                    />
                    <span>Evento Virtual</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        name="isSurprise"
                        checked={formData.isSurprise}
                        onChange={handleChange}
                        style={{ width: 'auto', margin: 0 }}
                    />
                    <span>Evento Sorpresa</span>
                </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
                <button
                    type="button"
                    onClick={onCancel}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Guardando...' : 'Guardar Evento'}
                </button>
            </div>
        </form>
    )
}
