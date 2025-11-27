import Link from 'next/link'
import { Event } from '@/types'
import Badge from './Badge'
import DeleteButton from './DeleteButton'
import { Calendar, MapPin, Pencil, ArrowRight } from 'lucide-react'

interface EventCardProps {
    event: Event & { guests?: any[] };
    onDelete: (id: number) => Promise<void>;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
    const date = new Date(event.date).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="card fade-in flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-200">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{event.title}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 capitalize">
                            <Calendar size={14} />
                            <span>{date}</span>
                        </div>
                    </div>
                    <Badge variant="info">{event.eventType}</Badge>
                </div>

                <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <div className="flex gap-2 mt-2">
                        {event.isVirtual && <Badge variant="info">Virtual</Badge>}
                        {event.isSurprise && <Badge variant="warning">Sorpresa</Badge>}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                <Link
                    href={`/events/${event.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 group"
                >
                    Ver detalles
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-2">
                    <Link
                        href={`/events/${event.id}/edit`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Editar"
                    >
                        <Pencil size={18} />
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
