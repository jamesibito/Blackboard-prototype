import { Link } from 'react-router-dom'
import { ChevronRight } from './Icons'

export interface Crumb {
  label: string
  to?: string
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[12px] mb-5">
      {items.map((crumb, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={11} className="text-gray-300 dark:text-gray-500" />}
            {isLast || !crumb.to ? (
              <span className={isLast ? 'font-medium text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400'}>
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.to}
                className="text-gray-400 dark:text-gray-400 hover:text-[var(--tenant-link)] dark:hover:text-[var(--tenant-link-dark)] transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
