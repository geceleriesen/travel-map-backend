import fs from "fs"

const raw = fs.readFileSync("./data/worldcities.csv","utf8")

const lines = raw.split("\n").slice(1)

const cities = []

for(const line of lines){

const cols = line.split(",")

cities.push({

name: cols[0].toLowerCase(),
lat: parseFloat(cols[2]),
lng: parseFloat(cols[3]),
country: cols[4]

})

}

export default cities
