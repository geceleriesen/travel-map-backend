import express from "express"
import cors from "cors"
import fs from "fs"

import {getAllVideos} from "./youtube.js"
import {detectCity} from "./cityDetector.js"
import {geocode} from "./geocode.js"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const CACHE_FILE = "cache.json"



function randomLocation(){

return {
lat:20+(Math.random()*60-30),
lng:(Math.random()*120-60)
}

}



async function buildVideoMap(){

const videos = await getAllVideos()

const mapped=[]

for(const v of videos){

let loc =
detectCity(v.title + " " + v.description)

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

if(fs.existsSync(CACHE_FILE)){

console.log("CACHE USED")

const cache =
JSON.parse(fs.readFileSync(CACHE_FILE))

return res.json(cache)

}

const data = await buildVideoMap()

fs.writeFileSync(
CACHE_FILE,
JSON.stringify(data)
)

res.json(data)

}catch(e){

console.log("SERVER ERROR",e)

res.json([])

}

})



app.get("/refresh", async(req,res)=>{

const data = await buildVideoMap()

fs.writeFileSync(
CACHE_FILE,
JSON.stringify(data)
)

res.json({
status:"updated",
videos:data.length
})

})



app.listen(PORT,()=>{

console.log("Travel Map Backend Running")

})
