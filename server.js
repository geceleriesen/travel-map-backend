import express from "express"
import cors from "cors"
import fs from "fs"

import {getAllVideos} from "./youtube.js"
import {detectCity} from "./cityDetector.js"
import {geocode} from "./geocode.js"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const CACHE="cache.json"



function randomLocation(){

return{
lat:20+(Math.random()*60-30),
lng:(Math.random()*120-60)
}

}



async function buildMap(){

const videos = await getAllVideos()

const mapped=[]

for(const v of videos){

let loc = detectCity(v.title+" "+v.description)

if(!loc){

loc = await geocode(v.title)

}

if(!loc){

loc = randomLocation()

}

mapped.push({

id:v.id,
title:v.title,
thumbnail:v.thumbnail,
lat:loc.lat,
lng:loc.lng

})

}

return mapped

}



app.get("/api/videos", async(req,res)=>{

try{

if(fs.existsSync(CACHE)){

console.log("CACHE USED")

return res.json(
JSON.parse(fs.readFileSync(CACHE))
)

}

const data = await buildMap()

fs.writeFileSync(
CACHE,
JSON.stringify(data)
)

res.json(data)

}catch(e){

console.log(e)

res.json([])

}

})



app.get("/refresh", async(req,res)=>{

const data = await buildMap()

fs.writeFileSync(
CACHE,
JSON.stringify(data)
)

res.json({
status:"cache updated",
videos:data.length
})

})



app.listen(PORT,()=>{

console.log("Travel Map Engine running")

})
