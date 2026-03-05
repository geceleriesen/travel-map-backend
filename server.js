import express from "express"
import cors from "cors"
import fetch from "node-fetch"
import fs from "fs"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

const CACHE_FILE = "cache.json"



async function getUploadsPlaylist(){

const url =
`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`

const res = await fetch(url)
const data = await res.json()

return data.items[0].contentDetails.relatedPlaylists.uploads

}



async function getAllVideos(){

const playlist = await getUploadsPlaylist()

let pageToken=""
let videos=[]

do{

const url =
`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&pageToken=${pageToken}&key=${API_KEY}`

const res = await fetch(url)
const data = await res.json()

for(const item of data.items){

videos.push({

id:item.snippet.resourceId.videoId,
title:item.snippet.title,
thumbnail:item.snippet.thumbnails.high.url,

// TEMP location
lat:(Math.random()*120)-60,
lng:(Math.random()*360)-180

})

}

pageToken=data.nextPageToken

}while(pageToken)

return videos

}



app.get("/",(req,res)=>{
res.send("Travel Map Backend Running")
})



app.get("/api/videos", async(req,res)=>{

try{

if(fs.existsSync(CACHE_FILE)){

const cache =
JSON.parse(fs.readFileSync(CACHE_FILE))

if(cache.length>0){
return res.json(cache)
}

}

const videos = await getAllVideos()

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
console.log("server running")
})
