import fetch from "node-fetch"

const cache = {}

export async function geocode(place){

if(cache[place]) return cache[place]

try{

const url =
"https://nominatim.openstreetmap.org/search?format=json&q=" +
encodeURIComponent(place)

const res = await fetch(url,{
headers:{
"User-Agent":"travel-map-engine"
}
})

const txt = await res.text()

if(txt.startsWith("<")) return null

const data = JSON.parse(txt)

if(!data.length) return null

const geo = {
lat:parseFloat(data[0].lat),
lng:parseFloat(data[0].lon),
name:data[0].display_name.split(",")[0]
}

cache[place] = geo

return geo

}catch{

return null

}

}
