import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import {getAllVideos} from "./youtube.js"

dotenv.config()

const app = express()

app.use(cors())

const PORT = 10000

let cache = []

async function buildMap(){

console.log("Loading channel videos...")

const videos = await getAllVideos()

const results = videos.map(v => {

return {

id: v.id,
title: v.title,

/* geçici lokasyon */

lat: 20 + Math.random()*40 - 20,
lng: Math.random()*120 - 60,

thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

}

})

cache = results

console.log("Videos loaded:", results.length)

}

app.get("/api/videos",(req,res)=>{
res.json(cache)
})

app.listen(PORT, async () => {

console.log("Travel Map Backend Running")

await buildMap()

})
