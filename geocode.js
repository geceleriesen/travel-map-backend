import fetch from "node-fetch"

export async function geocode(place){

const url =
`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`

const res = await fetch(url,{
headers:{
"User-Agent":"travel-map"
}
})

const data = await res.json()

if(!data.length) return null

return {
lat:parseFloat(data[0].lat),
lng:parseFloat(data[0].lon)
}

}
