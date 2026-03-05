import fs from "fs"

const cities =
JSON.parse(fs.readFileSync("./cities.json"))

export function detectCity(text){

if(!text) return null

text = text.toLowerCase()

for(const city of cities){

if(text.includes(city.name.toLowerCase())){

return {
lat:city.lat,
lng:city.lng,
name:city.name
}

}

}

return null

}
