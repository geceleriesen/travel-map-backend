import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import {getAllVideos} from "./youtube.js"
import {detectLocation} from "./locationEngine.js"

dotenv.config()

const app = express()
app.use(cors())

const PORT = 10000

let cache=[]

async function buildMap(){

console.log("Scanning channel...")

const videos = await getAllVideos()

const results=[]

for(const v of videos){

const location = await detectLocation(
v.title+" "+v.description
)

if(!location) continue

results.push({

id:v.id,
title:v.title,
lat:location.lat,
lng:location.lng,
location:location.name,
thumbnail:`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

})

}

cache=results

console.log("Mapped videos:",results.length)

}

app.get("/api/videos",(req,res)=>{
res.json(cache)
})

app.listen(PORT,async()=>{

console.log("Travel Map Engine running")

await buildMap()

})
