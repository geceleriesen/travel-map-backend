import express from "express"
import cors from "cors"
import fs from "fs"

import {getChannelVideos} from "./youtube.js"
import {detectCity} from "./cityDetector.js"

const app = express()

app.use(cors())

const PORT = process.env.PORT || 10000
const CHANNEL = process.env.CHANNEL || "@geceleriesen"

const CACHE="cache.json"



async function buildMap(){

const videos = await getChannelVideos(CHANNEL)

const result=[]

for(const v of videos){

const loc = detectCity(v.title)

if(!loc) continue

result.push({

id:v.id,
title:v.title,
thumbnail:v.thumbnail,
lat:loc.lat,
lng:loc.lng

})

}

return result

}



app.get("/",(req,res)=>{
res.send("Backend running")
})



app.get("/api/videos", async(req,res)=>{

try{

if(fs.existsSync(CACHE)){

const cache =
JSON.parse(fs.readFileSync(CACHE))

if(cache.length>0){
return res.json(cache)
}

}

const data = await buildMap()

fs.writeFileSync(
CACHE,
JSON.stringify(data,null,2)
)

res.json(data)

}catch(e){

console.log(e)

res.json([])

}

})



app.listen(PORT,()=>{
console.log("Server started")
})
