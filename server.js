import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())

const API = "https://www.googleapis.com/youtube/v3"
const PORT = process.env.PORT || 10000


async function getAllVideos(){

let pageToken=""
let videos=[]

do{

const res = await fetch(
`${API}/search?key=${process.env.YOUTUBE_API_KEY}
&channelId=${process.env.YOUTUBE_CHANNEL_ID}
&part=snippet,id
&type=video
&maxResults=50
&pageToken=${pageToken}`
)

const data = await res.json()

if(!data.items) break

data.items.forEach(v=>{

videos.push({

id:v.id.videoId,
title:v.snippet.title,
description:v.snippet.description

})

})

pageToken=data.nextPageToken

}while(pageToken)

return videos

}


function detectLocation(text){

text=text.toLowerCase()

if(text.includes("mexico")||text.includes("meksika"))
return {lat:23.6345,lng:-102.5528}

if(text.includes("cairo")||text.includes("kahire"))
return {lat:30.0444,lng:31.2357}

if(text.includes("medina")||text.includes("medine"))
return {lat:24.5247,lng:39.5692}

if(text.includes("mecca")||text.includes("mekke"))
return {lat:21.3891,lng:39.8579}

if(text.includes("riyadh")||text.includes("riyad"))
return {lat:24.7136,lng:46.6753}

if(text.includes("puerto rico")||text.includes("porto riko"))
return {lat:18.2208,lng:-66.5901}

return null

}


app.get("/api/videos", async (req,res)=>{

try{

const videos = await getAllVideos()

const mapped=[]

videos.forEach(v=>{

const loc = detectLocation(v.title+" "+v.description)

if(!loc) return

mapped.push({

id:v.id,
title:v.title,
lat:loc.lat,
lng:loc.lng,
thumbnail:`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

})

})

res.json(mapped)

}catch(err){

console.log(err)

res.status(500).json({error:"server crash"})

}

})


app.get("/",(req,res)=>{

res.send("Travel Map Backend Running")

})


app.listen(PORT,()=>{

console.log("Server started")

})
