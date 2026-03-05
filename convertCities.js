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
name:city.toLowerCase(),
lat:lat,
lng:lng
})

}

fs.writeFileSync("cities.json",JSON.stringify(cities,null,2))

console.log("cities.json created:",cities.length)
