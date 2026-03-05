import fs from "fs"

const cities=
JSON.parse(fs.readFileSync("./cities.json"))

export function detectCity(title){

const t=title.toLowerCase()

for(const c of cities){

if(t.includes(c.name.toLowerCase())){

return {
lat:c.lat,
lng:c.lng
}

}

}

return null

}
