'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, CalendarDays, Sparkles, Sun, Moon } from 'lucide-react'

export default function Header() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    useEffect(() => {
        // Leer tema guardado
        const savedTheme = localStorage.getItem('event-manager-theme') as 'dark' | 'light' | null
        if (savedTheme) {
            setTheme(savedTheme)
            document.documentElement.setAttribute('data-theme', savedTheme)
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        localStorage.setItem('event-manager-theme', newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
    }

    return (
        <header className="header">
            <div className="header-container">
                <div>
                    <Link href="/events" className="header-title" style={{ textDecoration: 'none' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles size={24} />
                            EventManager
                        </span>
                    </Link>
                    <p className="header-subtitle">Gestión y Organización de Eventos</p>
                </div>
                <nav className="header-nav">
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <Link
                        href="/events"
                        className="btn-ghost"
                        style={{ textDecoration: 'none' }}
                    >
                        <CalendarDays size={18} />
                        <span>Mis Eventos</span>
                    </Link>
                    <Link
                        href="/events/new"
                        className="btn-primary"
                        style={{ textDecoration: 'none' }}
                    >
                        <Plus size={18} />
                        <span>Nuevo</span>
                    </Link>
                </nav>
            </div>
        </header>
    )
}
