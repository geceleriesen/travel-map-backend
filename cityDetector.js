import fs from "fs"
import {countries} from "./countries.js"

const csv = fs.readFileSync("./worldcities.csv","utf8")

const lines = csv.split("\n")

const cities=[]

for(let i=1;i<lines.length;i++){

const p=lines[i].split(",")

if(p.length<4) continue

cities.push({

name:p[0].toLowerCase(),
lat:parseFloat(p[2]),
lng:parseFloat(p[3])

})

}

export default function detectCity(title){

title=title.toLowerCase()

// şehir kontrol

for(const city of cities){

if(title.includes(city.name)){

return{
name:city.name,
lat:city.lat,
lng:city.lng
}

}

}

// ülke kontrol

for(const key in countries){

if(title.includes(key)){

return countries[key]

}

}

return{
name:null,
lat:null,
lng:null
}

}
