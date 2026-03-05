export default async function locate(title){

title = title.toLowerCase()

const words = title.split(" ")

for(const word of words){

if(word.length < 4) continue

try{

const res = await fetch(
`https://nominatim.openstreetmap.org/search?q=${word}&format=json&limit=1`
)

const data = await res.json()

if(data.length){

return {
lat: parseFloat(data[0].lat),
lng: parseFloat(data[0].lon)
}

}

}catch(e){}

}

return {lat:0,lng:0}

}
