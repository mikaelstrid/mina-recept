import Link from 'next/link'
import type { Tag } from '@/types/entities'

interface TagBadgeProps {
  tag: Tag
  count?: number
}

export function TagBadge({ tag, count }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${tag.id}`}
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {tag.name}
      {count !== undefined && (
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">{count}</span>
      )}
    </Link>
  )
}
