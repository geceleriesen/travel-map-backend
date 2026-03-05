import fs from "fs"

const csv = fs.readFileSync("worldcities.csv","utf8")

const lines = csv.split("\n")

const cities=[]

for(let i=1;i<lines.length;i++){

const row = lines[i].split(",")

const city = row[0]
const lat = parseFloat(row[2])
const lng = parseFloat(row[3])

if(!city || isNaN(lat) || isNaN(lng)) continue

cities.push({
name: city.toLowerCase(),
lat: lat,
lng: lng
})

}

export default function detectCity(title){

title = title.toLowerCase()

for(const city of cities){

if(title.includes(city.name)){

return city

}

}

return {
lat:0,
lng:0
}

}
