import type { Tag } from '../types'

export default function ProductTag({ tag }: { tag: Tag }) {
  if (!tag) return null

  const isSale = tag === 'sale'

  return (
    <span
      className={`absolute left-0 top-0 rounded-[4px] px-2 py-[3px] text-[9px] font-medium uppercase tracking-[0.06em] ${
        isSale ? 'bg-sand text-ink' : 'bg-charcoal text-surface'
      }`}
    >
      {isSale ? 'Sale' : 'New'}
    </span>
  )
}
