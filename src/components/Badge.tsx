interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    const variants = {
        default: { backgroundColor: 'var(--gray-200)', color: 'var(--gray-800)' },
        success: { backgroundColor: '#e8f5e9', color: '#1b5e20' },
        warning: { backgroundColor: '#fff3e0', color: '#e65100' },
        danger: { backgroundColor: '#ffebee', color: '#b71c1c' },
        info: { backgroundColor: '#e3f2fd', color: '#0d47a1' },
    }

    return (
        <span
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500',
                ...variants[variant]
            }}
        >
            {children}
        </span>
    )
}
