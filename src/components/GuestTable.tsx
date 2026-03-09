'use client'

import { useState } from 'react'
import { Guest } from '@/types'
import Badge from './Badge'
import DeleteButton from './DeleteButton'
import GuestForm from './GuestForm'
import { Search, UserPlus, Pencil, Filter } from 'lucide-react'

interface GuestTableProps {
    guests: Guest[];
    eventId: number;
    onUpdate: () => void;
}

export default function GuestTable({ guests, eventId, onUpdate }: GuestTableProps) {
    const [editingGuest, setEditingGuest] = useState<Guest | undefined>(undefined)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all')
    const [search, setSearch] = useState('')

    const handleDelete = async (id: number) => {
        try {
            await fetch(`/api/guests/${id}`, { method: 'DELETE' })
            onUpdate()
        } catch (error) {
            console.error('Error deleting guest:', error)
        }
    }

    const filteredGuests = guests.filter(guest => {
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'confirmed' ? guest.confirmed :
                    !guest.confirmed

        const matchesSearch = guest.name.toLowerCase().includes(search.toLowerCase())

        return matchesFilter && matchesSearch
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Controles de filtro */}
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
            }}>
                {/* Búsqueda */}
                <div style={{ position: 'relative', flex: '1 1 250px', minWidth: '200px' }}>
                    <Search 
                        size={18} 
                        style={{ 
                            position: 'absolute', 
                            left: '0.875rem', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: 'var(--text-muted)' 
                        }} 
                    />
                    <input
                        type="text"
                        placeholder="Buscar invitado..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ 
                            width: '100%',
                            paddingLeft: '2.75rem',
                        }}
                    />
                </div>

                {/* Filtro */}
                <div style={{ position: 'relative' }}>
                    <Filter 
                        size={16} 
                        style={{ 
                            position: 'absolute', 
                            left: '0.875rem', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: 'var(--text-muted)',
                            pointerEvents: 'none',
                        }} 
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'confirmed' | 'pending')}
                        style={{ 
                            paddingLeft: '2.5rem',
                            minWidth: '150px',
                        }}
                    >
                        <option value="all">Todos</option>
                        <option value="confirmed">Confirmados</option>
                        <option value="pending">Pendientes</option>
                    </select>
                </div>

                {/* Botón añadir */}
                <button
                    onClick={() => { setEditingGuest(undefined); setIsModalOpen(true) }}
                    className="btn-primary"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    <UserPlus size={18} />
                    Añadir Invitado
                </button>
            </div>

            {/* Tabla de invitados */}
            <div className="table-container">
                <div className="table-scroll">
                    <table style={{ minWidth: '600px' }}>
                        <thead>
                            <tr>
                                <th>Invitado</th>
                                <th>Origen</th>
                                <th>Acompañantes</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGuests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                        {search || filter !== 'all' 
                                            ? 'No se encontraron invitados con esos criterios'
                                            : 'No hay invitados registrados'}
                                    </td>
                                </tr>
                            ) : (
                                filteredGuests.map(guest => (
                                    <tr key={guest.id}>
                                        <td>
                                            <div>
                                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {guest.name}
                                                </span>
                                                {guest.relationship && (
                                                    <span style={{ 
                                                        display: 'block', 
                                                        fontSize: '0.8rem', 
                                                        color: 'var(--text-muted)' 
                                                    }}>
                                                        {guest.relationship}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>{guest.origin || '—'}</td>
                                        <td>
                                            <Badge variant={guest.companions > 0 ? 'info' : 'default'}>
                                                +{guest.companions}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge variant={guest.confirmed ? 'success' : 'warning'}>
                                                {guest.confirmed ? '✓ Confirmado' : '⏳ Pendiente'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => { setEditingGuest(guest); setIsModalOpen(true) }}
                                                    style={{
                                                        padding: '0.5rem',
                                                        background: 'rgba(99, 102, 241, 0.1)',
                                                        color: 'var(--accent-primary)',
                                                        borderRadius: 'var(--radius-sm)',
                                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                                    }}
                                                    title="Editar invitado"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <DeleteButton
                                                    onConfirm={() => handleDelete(guest.id)}
                                                    itemName="invitado"
                                                    iconOnly
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <GuestForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                eventId={eventId}
                guest={editingGuest}
                onSave={onUpdate}
            />
        </div>
    )
}
