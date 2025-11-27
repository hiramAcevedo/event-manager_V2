import Link from 'next/link'
import { Plus, Calendar } from 'lucide-react'

export default function Header() {
    return (
        <header className="text-white shadow-md py-4" style={{ backgroundColor: '#1a252f' }}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold leading-tight">Sistema de Gestión de Eventos</h1>
                    <p className="text-xs text-gray-400">Gestión y Organización de Eventos</p>
                </div>
                <nav className="flex items-center gap-3">
                    <Link
                        href="/events"
                        className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium text-white hover:brightness-110"
                        style={{ backgroundColor: '#e74c3c' }}
                    >
                        <Calendar size={18} />
                        <span>Lista</span>
                    </Link>
                    <Link
                        href="/events/new"
                        className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium text-white hover:bg-[#ffffff33]"
                        style={{ backgroundColor: '#ffffff1a' }}
                    >
                        <Plus size={18} />
                        <span>Nuevo</span>
                    </Link>
                </nav>
            </div>
        </header>
    )
}
