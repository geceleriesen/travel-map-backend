import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import {getAllVideos} from "./youtube.js"
import {detectLocation} from "./cityDetector.js"
import {geocode} from "./geocode.js"

dotenv.config()

const app = express()
app.use(cors())

const PORT = 10000

let cache = []

async function buildMap(){

console.log("Scanning videos...")

const videos = await getAllVideos()

const result = []

for(const v of videos){

const place = detectLocation(v.title)

if(!place) continue

const coords = await geocode(place)

if(!coords) continue

result.push({

id:v.id,
title:v.title,
location:place,
lat:coords.lat,
lng:coords.lng,
thumbnail:`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

})

console.log("Mapped:",place)

}

cache = result

console.log("Total mapped:",cache.length)

}

app.get("/api/videos",(req,res)=>{

res.json(cache)

})

app.listen(PORT, async ()=>{

console.log("Backend started")

await buildMap()

})
