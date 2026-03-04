import fetch from "node-fetch"

export async function detectLocation(text){

const words=text.split(" ")

for(const w of words){

if(w.length<4) continue

try{

const url=
`https://nominatim.openstreetmap.org/search?q=${w}&format=json&limit=1`

const res=await fetch(url,{
headers:{'User-Agent':'travel-map'}
})

const data=await res.json()

if(data.length>0){

return{

name:data[0].display_name,
lat:parseFloat(data[0].lat),
lng:parseFloat(data[0].lon)

}

}

}catch(e){}

}

return null

}
