'use client'

import { useState, useEffect } from 'react'
import { Guest, GuestFormData } from '@/types'
import { X, Save, User, MapPin, Users, Link2, CheckCircle } from 'lucide-react'

interface GuestFormProps {
    guest?: Guest;
    eventId: number;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function GuestForm({ guest, eventId, isOpen, onClose, onSave }: GuestFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<GuestFormData>({
        name: '',
        origin: '',
        companions: 0,
        confirmed: false,
        relationship: '',
        notes: ''
    })

    useEffect(() => {
        if (guest) {
            setFormData({
                name: guest.name,
                origin: guest.origin || '',
                companions: guest.companions,
                confirmed: guest.confirmed,
                relationship: guest.relationship || '',
                notes: guest.notes || ''
            })
        } else {
            setFormData({
                name: '',
                origin: '',
                companions: 0,
                confirmed: false,
                relationship: '',
                notes: ''
            })
        }
    }, [guest, isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const url = guest ? `/api/guests/${guest.id}` : '/api/guests'
            const method = guest ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, eventId })
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.details || 'Error al guardar invitado')
            }

            onSave()
            onClose()
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : 'Error al guardar invitado')
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* Header del modal */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-primary)',
                }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={20} style={{ color: 'var(--accent-primary)' }} />
                        {guest ? 'Editar Invitado' : 'Nuevo Invitado'}
                    </h3>
                    <button 
                        onClick={onClose}
                        style={{
                            padding: '0.5rem',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-muted)',
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Nombre Completo *</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Nombre del invitado"
                                value={formData.name}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Origen y Acompañantes */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Origen</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    name="origin"
                                    placeholder="Ciudad"
                                    value={formData.origin}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Acompañantes</label>
                            <div style={{ position: 'relative' }}>
                                <Users size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="number"
                                    name="companions"
                                    min="0"
                                    value={formData.companions}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Relación */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Relación / Grupo</label>
                        <div style={{ position: 'relative' }}>
                            <Link2 size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                name="relationship"
                                placeholder="Ej. Familia, Trabajo, Amigos"
                                value={formData.relationship}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Notas */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Notas</label>
                        <textarea
                            name="notes"
                            rows={2}
                            placeholder="Información adicional..."
                            value={formData.notes}
                            onChange={handleChange}
                            style={{ 
                                ...inputStyle, 
                                paddingLeft: '1rem',
                                resize: 'vertical',
                                minHeight: '70px',
                            }}
                        />
                    </div>

                    {/* Checkbox de confirmación */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem',
                        padding: '1rem',
                        background: formData.confirmed ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-primary)',
                        border: `1px solid ${formData.confirmed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-primary)'}`,
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem',
                        cursor: 'pointer',
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, confirmed: !prev.confirmed }))}
                    >
                        <input
                            type="checkbox"
                            name="confirmed"
                            id="confirmed"
                            checked={formData.confirmed}
                            onChange={handleChange}
                            style={{ 
                                width: '1.25rem', 
                                height: '1.25rem',
                                cursor: 'pointer',
                            }}
                        />
                        <div>
                            <span style={{ 
                                fontWeight: 600, 
                                color: formData.confirmed ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <CheckCircle size={16} />
                                Confirmar asistencia
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {formData.confirmed ? 'El invitado ha confirmado' : 'Pendiente de confirmación'}
                            </span>
                        </div>
                    </div>

                    {/* Botones */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: '0.75rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border-primary)',
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-ghost"
                        >
                            <X size={16} />
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            <Save size={16} />
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
