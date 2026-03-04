import fetch from "node-fetch"

export async function geocode(query){

try{

const url =
`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`

const res = await fetch(url)

const data = await res.json()

if(data.length){

return {
lat: parseFloat(data[0].lat),
lng: parseFloat(data[0].lon)
}

}

}catch(e){
console.log("GEOCODE FAIL")
}

return null

}
