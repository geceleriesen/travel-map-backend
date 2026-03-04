import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import fetch from "node-fetch"

dotenv.config()

const app = express()
app.use(cors())

const PORT = 10000

const API = "https://www.googleapis.com/youtube/v3"

async function getUploadsPlaylist(){

const res = await fetch(
`${API}/channels?part=contentDetails&id=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`
)

const data = await res.json()

return data.items[0].contentDetails.relatedPlaylists.uploads

}

async function getVideos(){

const playlist = await getUploadsPlaylist()

let next = ""
const videos = []

do{

const res = await fetch(
`${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&pageToken=${next}&key=${process.env.YOUTUBE_API_KEY}`
)

const data = await res.json()

data.items.forEach(v=>{

videos.push({
id:v.snippet.resourceId.videoId,
title:v.snippet.title
})

})

next = data.nextPageToken

}while(next)

return videos

}

function detectLocation(title){

title = title.toLowerCase()

if(title.includes("mexico") || title.includes("meksika"))
return {lat:23.6345,lng:-102.5528}

if(title.includes("kahire") || title.includes("cairo"))
return {lat:30.0444,lng:31.2357}

if(title.includes("medine") || title.includes("medina"))
return {lat:24.5247,lng:39.5692}

if(title.includes("mekke") || title.includes("mecca"))
return {lat:21.3891,lng:39.8579}

if(title.includes("riyad") || title.includes("riyadh"))
return {lat:24.7136,lng:46.6753}

if(title.includes("porto riko") || title.includes("puerto rico"))
return {lat:18.2208,lng:-66.5901}

return null
}

app.get("/api/videos", async (req,res)=>{

const videos = await getVideos()

const result = []

videos.forEach(v=>{

const loc = detectLocation(v.title)

if(!loc) return

result.push({

id:v.id,
title:v.title,
lat:loc.lat,
lng:loc.lng,
thumbnail:`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

})

})

res.json(result)

})

app.listen(PORT,()=>{

console.log("Travel Map Backend Running")

})
