'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import EventCard from '@/components/EventCard'
import { Event } from '@/types'
import { LayoutGrid, List, Plus, Eye, Pencil, Trash2, MapPin } from 'lucide-react'
import Badge from '@/components/Badge'
import DeleteButton from '@/components/DeleteButton'

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

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
        return <div className="text-center py-10">Cargando eventos...</div>
    }

    return (
        <div className="fade-in space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Lista de Eventos</h1>
                    <p className="text-gray-500 text-sm">Gestiona tus eventos desde aquí</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-300 rounded-md p-1 flex items-center">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Vista de lista"
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Vista de cuadrícula"
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>

                    <Link
                        href="/events/new"
                        className="btn-secondary flex items-center gap-2 px-4 py-2"
                        style={{ textDecoration: 'none' }}
                    >
                        <Plus size={18} />
                        <span>Nuevo Evento</span>
                    </Link>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="card text-center py-16">
                    <p className="text-gray-500 mb-4">No hay eventos registrados aún.</p>
                    <Link
                        href="/events/new"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Crear mi primer evento
                    </Link>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-800 text-white">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Título</th>
                                            <th className="px-6 py-4 font-semibold">Fecha</th>
                                            <th className="px-6 py-4 font-semibold">Ubicación</th>
                                            <th className="px-6 py-4 font-semibold">Organizador</th>
                                            <th className="px-6 py-4 font-semibold">Tipo de Evento</th>
                                            <th className="px-6 py-4 font-semibold">Modalidad</th>
                                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {events.map(event => (
                                            <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(event.date).toLocaleDateString('es-MX')}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={14} className="text-gray-400" />
                                                        {event.location}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{event.organizer}</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="info">{event.eventType}</Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={event.isVirtual ? 'info' : 'success'}>
                                                        {event.isVirtual ? 'Virtual' : 'Presencial'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={`/events/${event.id}`}
                                                            className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                                                            title="Ver detalles"
                                                        >
                                                            <Eye size={18} />
                                                        </Link>
                                                        <Link
                                                            href={`/events/${event.id}/edit`}
                                                            className="p-2 bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-100 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Pencil size={18} />
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
