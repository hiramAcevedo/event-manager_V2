'use client'

import { useRouter } from 'next/navigation'
import EventForm from '@/components/EventForm'
import { EventFormData } from '@/types'

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
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>Crear Nuevo Evento</h1>
            <EventForm
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
            />
        </div>
    )
}
