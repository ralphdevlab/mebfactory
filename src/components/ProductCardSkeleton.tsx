export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] overflow-hidden rounded-[6px] bg-hero" />
      <div className="pt-2 pb-3">
        <div className="h-2.5 w-16 rounded-sm bg-border" />
        <div className="mt-2 h-3 w-24 rounded-sm bg-border" />
        <div className="mt-2 h-3 w-10 rounded-sm bg-border" />
      </div>
    </div>
  )
}
