import express from "express"
import cors from "cors"

const app = express()
app.use(cors())

const API="https://www.googleapis.com/youtube/v3"
const PORT=10000


async function getChannelVideos(){

let pageToken=""
let videos=[]

do{

const res = await fetch(
`${API}/search?part=snippet&type=video&maxResults=50&channelId=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}&pageToken=${pageToken}`
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

const videos = await getChannelVideos()

const mapped = videos.map(v=>({

id:v.id,
title:v.title,
thumbnail:v.thumbnail,

/* temporary coordinates */

lat:20 + (Math.random()*60-30),
lng:(Math.random()*120-60)

}))

res.json(mapped)

})


app.listen(PORT,()=>{

console.log("Travel backend running")

})
