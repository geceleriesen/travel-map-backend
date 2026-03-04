import express from "express"
import cors from "cors"
import fs from "fs"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const CHANNEL =
"https://www.youtube.com/@YOUR_CHANNEL/videos"


const cities =
JSON.parse(fs.readFileSync("./cities.json"))


function detectCity(text){

text = text.toLowerCase()

for(const c of cities){

if(text.includes(c.name.toLowerCase())){

return {
city:c.name,
lat:c.lat,
lng:c.lng
}

}

}

return null

}


async function geocode(query){

try{

const url =
`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`

const res = await fetch(url)

const data = await res.json()

if(data.length){

return {
lat:parseFloat(data[0].lat),
lng:parseFloat(data[0].lon)
}

}

}catch(e){}

return null

}


function randomLocation(){

return {
lat:20 + (Math.random()*60-30),
lng:(Math.random()*120-60)
}

}


async function getVideos(){

const res = await fetch(CHANNEL)

const html = await res.text()


const ids =
[...html.matchAll(/"videoId":"(.*?)"/g)]
.map(v=>v[1])

const titles =
[...html.matchAll(/"title":{"runs":\[\{"text":"(.*?)"/g)]
.map(v=>v[1])


const unique = [...new Set(ids)]

const videos = []


for(let i=0;i<unique.length;i++){

const id = unique[i]

const title = titles[i] || "Video"

let loc = detectCity(title)

if(!loc){

loc = await geocode(title)

}

if(!loc){

loc = randomLocation()

}

videos.push({

id,
title,

thumbnail:
`https://img.youtube.com/vi/${id}/hqdefault.jpg`,

lat:loc.lat,
lng:loc.lng

})

}

return videos

}


app.get("/api/videos", async(req,res)=>{

try{

const vids = await getVideos()

res.json(vids)

}catch(e){

console.log(e)

res.json([])

}

})


app.listen(PORT,()=>{

console.log("Travel Map Engine running")

})
