import fs from "fs"

const cities = JSON.parse(
fs.readFileSync("./cities.json","utf8")
)

export default function detectCity(title){

title = title.toLowerCase()

for(const city of cities){

if(title.includes(city.name.toLowerCase())){

return city

}

}

return {
lat:0,
lng:0
}

}
