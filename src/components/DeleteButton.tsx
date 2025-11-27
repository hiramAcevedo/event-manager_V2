'use client'

import { useState } from 'react'
import { Trash2, X, Check } from 'lucide-react'

interface DeleteButtonProps {
    onConfirm: () => Promise<void>;
    itemName: string;
    className?: string;
    iconOnly?: boolean;
}

export default function DeleteButton({ onConfirm, itemName, className = '', iconOnly = false }: DeleteButtonProps) {
    const [isConfirming, setIsConfirming] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        await onConfirm()
        setIsDeleting(false)
    }

    if (isConfirming) {
        return (
            <div 
                className="fade-in"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.75rem',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-md)',
                }}
            >
                <span style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 600 }}>
                    ¿Eliminar?
                </span>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    style={{
                        padding: '0.25rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        borderRadius: '4px',
                        color: '#f87171',
                        minWidth: 'auto',
                    }}
                    title="Confirmar"
                >
                    {isDeleting ? '...' : <Check size={14} />}
                </button>
                <button
                    onClick={() => setIsConfirming(false)}
                    disabled={isDeleting}
                    style={{
                        padding: '0.25rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        color: 'var(--text-muted)',
                        minWidth: 'auto',
                    }}
                    title="Cancelar"
                >
                    <X size={14} />
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setIsConfirming(true)}
            className={className}
            style={{
                padding: iconOnly ? '0.5rem' : '0.5rem 0.75rem',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
            }}
            title={`Eliminar ${itemName}`}
        >
            <Trash2 size={16} />
            {!iconOnly && <span>Eliminar</span>}
        </button>
    )
}
