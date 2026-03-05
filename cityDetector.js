import fs from "fs"

const csv = fs.readFileSync("./worldcities.csv","utf8")

const lines = csv.split("\n")

const cities=[]

for(let i=1;i<lines.length;i++){

const parts=lines[i].split(",")

if(parts.length<4) continue

cities.push({

name:parts[0].toLowerCase(),
lat:parseFloat(parts[2]),
lng:parseFloat(parts[3])

})

}

export default function detectCity(title){

title=title.toLowerCase()

for(const city of cities){

if(title.includes(city.name)){

return city

}

}

return {lat:0,lng:0}

}
