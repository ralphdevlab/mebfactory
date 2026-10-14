export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] overflow-hidden rounded-[8px] bg-paper" />
      <div className="px-2 pb-2 pt-2">
        <div className="h-2.5 w-24 bg-border" />
        <div className="mt-2 h-3 w-10 bg-border" />
      </div>
    </div>
  )
}
