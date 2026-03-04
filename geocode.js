import fetch from "node-fetch"

const placeCache = {}

export async function geocode(text) {

  const match =
    text.match(/(istanbul|kahire|giza|mexico|porto rico|san juan|beijing)/i)

  if (!match) return null

  const place = match[0].toLowerCase()

  if (placeCache[place]) return placeCache[place]

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      place
    )}&format=json`
  )

  const data = await res.json()

  if (!data.length) return null

  const geo = {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    name: data[0].display_name.split(",")[0]
  }

  placeCache[place] = geo

  return geo
}
