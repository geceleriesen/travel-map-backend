import fs from "fs"

const cities =
JSON.parse(fs.readFileSync("./cities.json"))

export function detectCity(text){

text=text.toLowerCase()

for(const city of cities){

if(text.includes(city.name.toLowerCase())){

return{
lat:city.lat,
lng:city.lng
}

}

}

return null

}
