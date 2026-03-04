import fs from "fs"
import https from "https"
import {execSync} from "child_process"

/* download geonames cities1000 */

const url =
"https://download.geonames.org/export/dump/cities1000.zip"

const zip="cities.zip"

console.log("Downloading city database...")

execSync(`curl -L ${url} -o ${zip}`)

console.log("Extracting...")

execSync(`unzip -o ${zip}`)

const raw = fs.readFileSync("cities1000.txt","utf8")

const lines = raw.split("\n")

const cities=[]

for(const line of lines){

if(!line) continue

const parts=line.split("\t")

cities.push({
name:parts[1],
lat:parseFloat(parts[4]),
lng:parseFloat(parts[5])
})

}

fs.writeFileSync(
"cities.json",
JSON.stringify(cities)
)

console.log("Cities created:",cities.length)
