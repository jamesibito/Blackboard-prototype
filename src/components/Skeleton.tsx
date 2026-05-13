// ─── Skeleton system ──────────────────────────────────────────────────────────
// Animated placeholder blocks used during simulated page loads.
// All components use animate-pulse and match the card/background token palette.

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

/** Base rectangular block — set width/height via className or style. */
export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-[#232d42] rounded-lg ${className}`}
      style={style}
    />
  )
}

/** One or more text-line skeletons. Last line is 65% wide to look natural. */
export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 dark:bg-[#232d42] rounded"
          style={{ height: 11, width: i === lines - 1 && lines > 1 ? '65%' : '100%' }}
        />
      ))}
    </div>
  )
}

/** Circular avatar placeholder. */
export function SkeletonAvatar({ size = 36 }: { size?: number }) {
  return (
    <div
      className="animate-pulse bg-gray-200 dark:bg-[#232d42] rounded-xl shrink-0"
      style={{ width: size, height: size }}
    />
  )
}

/**
 * Card wrapper — white/dark card background with border, accepts children.
 * Wrap Skeleton primitives inside to build page-specific skeletons.
 */
export function SkeletonCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
