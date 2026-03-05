import express from "express"
import cors from "cors"
import fs from "fs"
import fetch from "node-fetch"
import { parseStringPromise } from "xml2js"

const app = express()

app.use(cors())

const PORT = process.env.PORT || 10000
const CHANNEL_ID = process.env.CHANNEL_ID || ""

const CACHE_FILE = "cache.json"



async function getVideos(){

if(!CHANNEL_ID){
console.log("CHANNEL_ID missing")
return []
}

const url =
`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

try{

const xml = await fetch(url).then(r=>r.text())

const data = await parseStringPromise(xml)

const entries = data.feed.entry || []

const videos=[]

for(const v of entries){

const id = v["yt:videoId"][0]
const title = v.title[0]

videos.push({
id,
title,
thumbnail:`https://img.youtube.com/vi/${id}/hqdefault.jpg`,
lat:20,
lng:0
})

}

return videos

}catch(e){

console.log("RSS ERROR",e)

return []

}

}



app.get("/",(req,res)=>{

res.send("Travel Map Backend Running")

})



app.get("/api/videos", async(req,res)=>{

try{

const videos = await getVideos()

fs.writeFileSync(
CACHE_FILE,
JSON.stringify(videos,null,2)
)

res.json(videos)

}catch(e){

console.log(e)

res.json([])

}

})



app.listen(PORT,()=>{

console.log("Server running on port",PORT)

})
