import express from "express"
import cors from "cors"
import fs from "fs"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

const API = "https://www.googleapis.com/youtube/v3"

const CACHE_FILE = "./videos.json"



/* RANDOM LOCATION (temporary) */

function randomLocation(){

return {
lat:20 + (Math.random()*60-30),
lng:(Math.random()*120-60)
}

}



/* FETCH VIDEOS FROM YOUTUBE */

async function fetchVideos(){

console.log("Fetching videos from YouTube...")

const channelRes = await fetch(
`${API}/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
)

const channelData = await channelRes.json()

if(!channelData.items){
console.log(channelData)
return []
}

const playlistId =
channelData.items[0].contentDetails.relatedPlaylists.uploads


let pageToken = ""
let videos = []

do{

const res = await fetch(
`${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${pageToken}&key=${API_KEY}`
)

const data = await res.json()

if(!data.items){
console.log("PLAYLIST ERROR",data)
break
}

data.items.forEach(v=>{

const loc = randomLocation()

videos.push({

id:v.snippet.resourceId.videoId,
title:v.snippet.title,
thumbnail:v.snippet.thumbnails.high.url,

lat:loc.lat,
lng:loc.lng

})

})

pageToken = data.nextPageToken

}while(pageToken)



/* SAVE CACHE */

fs.writeFileSync(CACHE_FILE,JSON.stringify(videos,null,2))

console.log("Videos cached:",videos.length)

return videos

}



/* API */

app.get("/api/videos",async(req,res)=>{

try{

if(fs.existsSync(CACHE_FILE)){

console.log("Using cache")

const cache =
JSON.parse(fs.readFileSync(CACHE_FILE))

return res.json(cache)

}

const vids = await fetchVideos()

res.json(vids)

}catch(e){

console.log(e)

res.json([])

}

})



/* MANUAL REFRESH */

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
