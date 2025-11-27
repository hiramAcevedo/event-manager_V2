'use client'

import { useState } from 'react'
import { Guest } from '@/types'
import Badge from './Badge'
import DeleteButton from './DeleteButton'
import GuestForm from './GuestForm'

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
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar invitado..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Todos</option>
                    <option value="confirmed">Confirmados</option>
                    <option value="pending">Pendientes</option>
                </select>
                <button
                    onClick={() => { setEditingGuest(undefined); setIsModalOpen(true) }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap"
                >
                    + Añadir Invitado
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Origen</th>
                                <th className="px-6 py-3">Acompañantes</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredGuests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron invitados
                                    </td>
                                </tr>
                            ) : (
                                filteredGuests.map(guest => (
                                    <tr key={guest.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {guest.name}
                                            {guest.relationship && <span className="block text-xs text-gray-500 font-normal">{guest.relationship}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{guest.origin || '-'}</td>
                                        <td className="px-6 py-4 text-gray-600">{guest.companions}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={guest.confirmed ? 'success' : 'default'}>
                                                {guest.confirmed ? 'Confirmado' : 'Pendiente'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button
                                                onClick={() => { setEditingGuest(guest); setIsModalOpen(true) }}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                ✏️
                                            </button>
                                            <DeleteButton
                                                onConfirm={() => handleDelete(guest.id)}
                                                itemName="invitado"
                                            />
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
