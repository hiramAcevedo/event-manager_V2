'use client'

import { useState, useEffect } from 'react'
import { Guest, GuestFormData } from '@/types'

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                        {guest ? 'Editar Invitado' : 'Nuevo Invitado'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Origen</label>
                            <input
                                type="text"
                                name="origin"
                                value={formData.origin}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Acompañantes</label>
                            <input
                                type="number"
                                name="companions"
                                min="0"
                                value={formData.companions}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Relación / Grupo</label>
                        <input
                            type="text"
                            name="relationship"
                            placeholder="Ej. Familia, Trabajo"
                            value={formData.relationship}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Notas</label>
                        <textarea
                            name="notes"
                            rows={2}
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            name="confirmed"
                            id="confirmed"
                            checked={formData.confirmed}
                            onChange={handleChange}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <label htmlFor="confirmed" className="text-sm font-medium text-gray-700">
                            Confirmar asistencia
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
