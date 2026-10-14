// Config for the homepage's horizontal-scroll category pills (directly below
// the hero). Client feedback (2026-10-14): drop the regular taxonomy pills
// (New In/Woman/Man/Tops/Bottoms/Outerwear/Sale) and show only the college
// capsule collections, each a solid school-color circle (no logos/branding)
// linking into /shop?collection=<tag>.
export interface CategoryPill {
  label: string
  color: string
  // Lowercase collection slug - matches SchoolContext's selectedSchool and
  // the school.collection values in src/data/schools.ts.
  collection: string
}

export const CATEGORY_PILLS: CategoryPill[] = [
  { label: 'UF', color: '#FA4616', collection: 'uf' },
  { label: 'FSU', color: '#782F40', collection: 'fsu' },
  { label: 'UCF', color: '#000000', collection: 'ucf' },
  { label: 'USF', color: '#006747', collection: 'usf' },
  { label: 'FAU', color: '#002857', collection: 'fau' },
  { label: 'MIAMI', color: '#F47321', collection: 'miami' },
  { label: 'HOWARD', color: '#003DA5', collection: 'howard' },
  { label: 'FAMU', color: '#F58426', collection: 'famu' },
  { label: 'BCU', color: '#862633', collection: 'bcu' },
  { label: 'SPELMAN', color: '#00205B', collection: 'spelman' },
]
