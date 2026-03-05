import express from "express"
import cors from "cors"
import fs from "fs"
import detectCity from "./cityDetector.js"

const app = express()

app.use(cors())

const raw = fs.readFileSync("./videos.json","utf8")
const videos = JSON.parse(raw)

const result = videos.map(v=>{

const city = detectCity(v.title)

return {

id:v.id,
title:v.title,
thumbnail:v.thumbnail,
lat:city.lat,
lng:city.lng

}

})

app.get("/",(req,res)=>{
res.send("Travel Map Backend Running")
})

app.get("/api/videos",(req,res)=>{
res.json(result)
})

const PORT = process.env.PORT || 10000

app.listen(PORT,()=>{
console.log("Server running",PORT)
})
