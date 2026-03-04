import express from "express"
import cors from "cors"
import fs from "fs"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

const CACHE_FILE = "./videos.json"

const API = "https://www.googleapis.com/youtube/v3"


async function fetchVideos(){

const channel = await fetch(
`${API}/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
)

const channelData = await channel.json()

const playlist =
channelData.items[0].contentDetails.relatedPlaylists.uploads

let pageToken=""
const videos=[]

do{

const res = await fetch(
`${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&pageToken=${pageToken}&key=${API_KEY}`
)

const data = await res.json()

data.items.forEach(v=>{

videos.push({

id:v.snippet.resourceId.videoId,
title:v.snippet.title,
thumbnail:v.snippet.thumbnails.high.url,

lat:20+(Math.random()*60-30),
lng:(Math.random()*120-60)

})

})

pageToken=data.nextPageToken

}while(pageToken)

fs.writeFileSync(CACHE_FILE,JSON.stringify(videos,null,2))

return videos

}


app.get("/api/videos",async(req,res)=>{

if(fs.existsSync(CACHE_FILE)){

const cache=JSON.parse(fs.readFileSync(CACHE_FILE))
return res.json(cache)

}

const vids = await fetchVideos()

res.json(vids)

})


app.get("/refresh",async(req,res)=>{

const vids = await fetchVideos()

res.json({
status:"refreshed",
videos:vids.length
})

})


app.listen(PORT,()=>{

console.log("Travel backend running")

})
