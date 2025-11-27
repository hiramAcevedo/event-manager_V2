'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import EventForm from '@/components/EventForm'
import { EventFormData } from '@/types'
import { ArrowLeft, CalendarPlus } from 'lucide-react'

export default function NewEventPage() {
    const router = useRouter()

    const handleSubmit = async (data: EventFormData) => {
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.details || 'Error creating event')
            }

            router.push('/events')
            router.refresh()
        } catch (error) {
            console.error('Error submitting form:', error)
            alert(error instanceof Error ? error.message : 'Error al crear el evento')
        }
    }

    return (
        <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Link 
                href="/events" 
                style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    marginBottom: '1rem',
                }}
            >
                <ArrowLeft size={16} />
                Volver a eventos
            </Link>
            
            <EventForm
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
            />
        </div>
    )
}
