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

console.log("Scanning channel videos...")

const videos = await getAllVideos()

const mapped=[]

for(const v of videos){

const location = await detectLocation(
v.title + " " + v.description
)

if(!location) continue

mapped.push({

id:v.id,
title:v.title,

lat:location.lat,
lng:location.lng,

location:location.name,

thumbnail:`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

})

}

cache=mapped

console.log("Videos mapped:",mapped.length)

}

app.get("/api/videos",(req,res)=>{
res.json(cache)
})

app.listen(PORT,async()=>{

console.log("Travel Map Backend Running")

await buildMap()

})
