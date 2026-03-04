import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import {getAllVideos} from "./youtube.js"
import {detectLocation} from "./locationDetector.js"

dotenv.config()

const app = express()
app.use(cors())

const PORT = 10000

let cache = []

async function buildMap(){

console.log("Scanning YouTube channel...")

const videos = await getAllVideos()

const results = []

for(const v of videos){

const location = detectLocation(v.title + " " + v.description)

if(!location) continue

let lat = location.lat
let lng = location.lng

// small offset to avoid overlapping pins
lat += (Math.random()-0.5)*0.5
lng += (Math.random()-0.5)*0.5

results.push({

id:v.id,
lat,
lng,
location:location.name,
title:v.title,
thumbnail:`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

})

}

cache = results

console.log("Videos mapped:", results.length)

}

app.get("/api/videos",(req,res)=>{

res.json(cache)

})

app.listen(PORT, async ()=>{

console.log("Travel Map Engine running")

await buildMap()

})
