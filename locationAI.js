const places = [
  "istanbul",
  "kahire",
  "giza",
  "mexico",
  "cancun",
  "porto rico",
  "puerto rico",
  "san juan",
  "beijing",
  "shanghai",
  "tokyo",
  "paris",
  "rome",
  "dubai"
]

export function detectLocation(text) {

  const clean = text.toLowerCase()

  for (const place of places) {
    if (clean.includes(place)) return place
  }

  const flagMatch = text.match(/🇦🇿|🇹🇷|🇪🇬|🇲🇽|🇨🇳|🇵🇷/)

  if (flagMatch) return flagMatch[0]

  return null
}
