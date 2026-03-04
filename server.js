import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import fs from "fs"

import {getChannelVideos} from "./youtube.js"
import {detectLocation} from "./locationAI.js"
import {geocode} from "./geocode.js"

dotenv.config()

const app = express()
app.use(cors())

const PORT=10000

let cache=[]

async function buildMap(){

console.log("Scanning channel videos...")

const videos = await getChannelVideos()

for(const v of videos){

const place = detectLocation(
v.title + " " + v.description
)

if(!place) continue

const coords = await geocode(place)

if(!coords) continue

cache.push({

id:v.id,
title:v.title,
location:place,
lat:coords.lat,
lng:coords.lng,
thumbnail:`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

})

console.log("Mapped:",place)

}

fs.writeFileSync(
"cache.json",
JSON.stringify(cache,null,2)
)

}

app.get("/api/videos",(req,res)=>{

res.json(cache)

})

app.listen(PORT,async()=>{

console.log("Travel Map Engine Running")

await buildMap()

})
