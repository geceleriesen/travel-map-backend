import express from "express"
import cors from "cors"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const CHANNEL_ID = "YOUR_CHANNEL_ID"

function randomLocation(){

return {
lat:20 + (Math.random()*60-30),
lng:(Math.random()*120-60)
}

}

async function getVideos(){

const url =
`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

const res = await fetch(url)

const xml = await res.text()

const entries = xml.split("<entry>")

const videos = []

entries.slice(1).forEach(e=>{

const id =
e.split("<yt:videoId>")[1]?.split("</yt:videoId>")[0]

const title =
e.split("<title>")[1]?.split("</title>")[0]

if(!id) return

const loc = randomLocation()

videos.push({

id,
title,

thumbnail:
`https://img.youtube.com/vi/${id}/hqdefault.jpg`,

lat:loc.lat,
lng:loc.lng

})

})

return videos

}

app.get("/api/videos", async (req,res)=>{

const videos = await getVideos()

res.json(videos)

})

app.listen(PORT,()=>{

console.log("Travel backend running")

})
