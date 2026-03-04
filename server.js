import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import {getAllVideos} from "./youtube.js"
import {detectCity} from "./cityDetector.js"
import {cities} from "./cities.js"

dotenv.config()

const app = express()

app.use(cors())

let cache = []

async function buildMap(){

console.log("Scanning channel...")

const videos = await getAllVideos()

const results = []

for(const v of videos){

let lat = null
let lng = null
let location = "Unknown"

const cityKey = detectCity(v.title + " " + v.description)

if(cityKey && cities[cityKey]){

lat = cities[cityKey].lat
lng = cities[cityKey].lng
location = cities[cityKey].name

}

if(lat && lng){

results.push({

id:v.id,
lat,
lng,
location,
title:v.title,
thumbnail:`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

})

}

}

cache = results

console.log("Videos mapped:",results.length)

}

app.get("/api/videos",(req,res)=>{

res.json(cache)

})

app.listen(10000, async ()=>{

console.log("Travel Map Engine running")

await buildMap()

})
