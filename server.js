import express from "express"
import cors from "cors"
import Parser from "rss-parser"

const app = express()
const parser = new Parser()

app.use(cors())

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

app.get("/", (req,res)=>{
res.send("Backend running")
})

app.get("/api/videos", async (req,res)=>{

try{

const feed = await parser.parseURL(
`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
)

const videos = feed.items.map(v=>{

const id=v.id.split(":").pop()

return{
id:id,
title:v.title,
thumbnail:`https://img.youtube.com/vi/${id}/hqdefault.jpg`,
lat:20+(Math.random()*40-20),
lng:0+(Math.random()*60-30)
}

})

res.json(videos)

}catch(e){

console.log(e)
res.json([])

}

})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

console.log("Server running on",PORT)

})
