import fetch from "node-fetch"

const cache = {}

export async function geocode(place) {

  if (cache[place]) return cache[place]

  const url =
    "https://nominatim.openstreetmap.org/search?format=json&q=" +
    encodeURIComponent(place)

  try {

    const res = await fetch(url, {
      headers: {
        "User-Agent": "travel-map-engine"
      }
    })

    const text = await res.text()

    // XML gelirse atla
    if (text.startsWith("<")) {
      console.log("Nominatim returned XML, skipping:", place)
      return null
    }

    const data = JSON.parse(text)

    if (!data.length) return null

    const geo = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      name: data[0].display_name.split(",")[0]
    }

    cache[place] = geo

    return geo

  } catch (err) {

    console.log("Geocode error:", place)

    return null
  }
}
