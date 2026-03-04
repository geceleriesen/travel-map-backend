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
thumbnail:v.snippet.thumbnails.high.url

})

})

pageToken=data.nextPageToken

}while(pageToken)

return videos

}



app.get("/api/videos", async (req,res)=>{

try{

const videos = await getAllVideos()

/* geçici koordinat */
const mapped = videos.map(v=>({

id:v.id,
title:v.title,
lat:20 + (Math.random()*60-30),
lng:(Math.random()*120-60),
thumbnail:v.thumbnail

}))

res.json(mapped)

}catch(e){

console.log(e)
res.json([])

}

})


app.get("/",(req,res)=>{

res.send("Travel Map Backend Running")

})


app.listen(PORT,()=>{

console.log("Server started")

})
