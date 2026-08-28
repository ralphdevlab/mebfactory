// Marker overlaid on every stock/placeholder image in the redesigned
// storefront so it's obvious at a glance which art is temporary.
export default function Placeholder() {
  return (
    <span className="pointer-events-none absolute bottom-1 right-1.5 z-10 text-[9px] font-normal text-white opacity-60">
      PLACEHOLDER — WILL BE REPLACED
    </span>
  )
}
