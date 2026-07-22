import type { Tag } from '../types'

export default function ProductTag({ tag }: { tag: Tag }) {
  if (!tag) return null

  const isSale = tag === 'sale'

  return (
    <span
      className={`label absolute left-3 top-3 px-2 py-1 text-[10px] ${
        isSale ? 'bg-sand text-ink' : 'bg-charcoal text-white'
      }`}
    >
      {isSale ? 'Sale' : 'New'}
    </span>
  )
}
