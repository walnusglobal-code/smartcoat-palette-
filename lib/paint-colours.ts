export type PaintColour = {
  id: string
  name: string
  hex: string
  rgb: string
  category: string
}

const baseColours = [
  ['Porcelain', '#F6F3EE', 'Neutral'], ['Alabaster', '#EEE9DE', 'Neutral'], ['Oat', '#DCCDB8', 'Neutral'], ['Sandstone', '#C8B08D', 'Neutral'], ['Clay', '#A97960', 'Earth'],
  ['Terracotta', '#B95E43', 'Earth'], ['Sienna', '#884735', 'Earth'], ['Cinnamon', '#A76542', 'Earth'], ['Poppy', '#D64736', 'Red'], ['Burgundy', '#641F2C', 'Red'],
  ['Rosewood', '#8F4B54', 'Red'], ['Blush', '#E9A7A0', 'Red'], ['Apricot', '#F0A06A', 'Orange'], ['Ochre', '#C58A28', 'Yellow'], ['Marigold', '#E1B12C', 'Yellow'],
  ['Lemon', '#E8D75A', 'Yellow'], ['Moss', '#7D8750', 'Green'], ['Sage', '#A9B798', 'Green'], ['Fern', '#55745B', 'Green'], ['Forest', '#1D4937', 'Green'],
  ['Jade', '#2D8174', 'Teal'], ['Aqua', '#72C9C1', 'Teal'], ['Lagoon', '#237D8B', 'Blue'], ['Sky', '#9AC8D7', 'Blue'], ['Cobalt', '#28558A', 'Blue'],
  ['Ocean', '#123B5A', 'Blue'], ['Navy', '#182A45', 'Blue'], ['Indigo', '#403C76', 'Purple'], ['Lavender', '#AAA5D1', 'Purple'], ['Plum', '#623E69', 'Purple'],
  ['Cocoa', '#765044', 'Brown'], ['Espresso', '#372A27', 'Brown'], ['Walnut', '#584035', 'Brown'], ['Graphite', '#43484A', 'Grey'], ['Slate', '#647176', 'Grey'],
  ['Steel', '#9AA7AA', 'Grey'], ['Charcoal', '#25292B', 'Grey'], ['Ink', '#111416', 'Black'],
] as const

const shifts = [
  { suffix: 'Mist', amount: 0.18 }, { suffix: 'Soft', amount: 0.08 }, { suffix: 'True', amount: 0 }, { suffix: 'Deep', amount: -0.08 },
] as const

function mix(hex: string, amount: number) {
  const n = Number.parseInt(hex.slice(1), 16)
  const r = n >> 16; const g = (n >> 8) & 255; const b = n & 255
  const target = amount > 0 ? 255 : 0
  const p = Math.abs(amount)
  return `#${[r, g, b].map((v) => Math.round(v + (target - v) * p).toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}

function rgb(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16)
  return `${n >> 16}, ${(n >> 8) & 255}, ${n & 255}`
}

export const paintColours: PaintColour[] = baseColours.flatMap(([name, hex, category]) => shifts.map(({ suffix, amount }, index) => {
  const colour = mix(hex, amount)
  return { id: `${name.toLowerCase()}-${suffix.toLowerCase()}`, name: suffix === 'True' ? name : `${suffix} ${name}`, hex: colour, rgb: rgb(colour), category: category + (index === 0 ? ' · Light' : '') }
}))

export const initialColour = paintColours.find((colour) => colour.name === 'Ocean') ?? paintColours[0]
