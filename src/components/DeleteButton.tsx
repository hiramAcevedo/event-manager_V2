'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'

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
            <div className="flex items-center gap-2 bg-red-50 px-2 py-1 rounded-md animate-fade-in">
                <span className="text-xs text-red-600 font-medium">¿Seguro?</span>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-700 hover:text-red-900 text-xs font-bold disabled:opacity-50"
                >
                    {isDeleting ? '...' : 'Sí'}
                </button>
                <button
                    onClick={() => setIsConfirming(false)}
                    disabled={isDeleting}
                    className="text-gray-500 hover:text-gray-700 text-xs disabled:opacity-50"
                >
                    No
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setIsConfirming(true)}
            className={`p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors ${className}`}
            title={`Eliminar ${itemName}`}
        >
            <Trash2 size={18} />
            {!iconOnly && <span className="ml-2">Eliminar</span>}
        </button>
    )
}
