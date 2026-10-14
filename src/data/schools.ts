// Single source of truth for the 10 college collections shown in the school
// selector modal. `name` (no emoji) is used in homepage section headers;
// the modal's buttons render `${name} ${emoji}`.
export interface School {
  name: string
  emoji: string
  collection: string
  color: string
  // UCF's gold is too light for white text to read on - true for it only.
  darkText?: boolean
}

export const SCHOOLS: School[] = [
  { name: 'GO GATORS', emoji: '🐊', collection: 'uf', color: '#FA4616' },
  { name: 'GO NOLES', emoji: '🍢', collection: 'fsu', color: '#782F40' },
  { name: 'GO KNIGHTS', emoji: '⚔️', collection: 'ucf', color: '#FFC904', darkText: true },
  { name: 'GO BULLS', emoji: '🐂', collection: 'usf', color: '#006747' },
  { name: 'GO OWLS', emoji: '🦉', collection: 'fau', color: '#003F7F' },
  { name: 'GO CANES', emoji: '🌀', collection: 'miami', color: '#F47321' },
  { name: 'GO BISON', emoji: '🦬', collection: 'howard', color: '#003A7D' },
  { name: 'GO RATTLERS', emoji: '🐍', collection: 'famu', color: '#FF6600' },
  { name: 'GO WILDCATS', emoji: '🐾', collection: 'bcu', color: '#6B0F1A' },
  { name: 'GO JAGUARS', emoji: '🐆', collection: 'spelman', color: '#1B3A6B' },
]

export function schoolName(collection: string): string | undefined {
  return SCHOOLS.find((s) => s.collection === collection)?.name
}
