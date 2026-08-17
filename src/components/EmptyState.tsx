import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
}

export default function EmptyState({ icon, title, description, actionLabel, actionTo, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-muted">{icon}</div>
      <h2 className="mt-4 text-lg font-medium text-ink">{title}</h2>
      {description && <p className="mt-2 text-sm font-normal text-muted">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-8">
          <Button variant="primary" className="px-10">
            {actionLabel}
          </Button>
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <Button variant="primary" className="mt-8 px-10" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
