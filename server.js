import express from "express"
import cors from "cors"
import getVideos from "./scraper.js"

const app = express()

app.use(cors())

app.get("/",(req,res)=>{
res.send("Travel Map Backend Running")
})

app.get("/api/videos", async (req,res)=>{

try{

const videos = await getVideos()

res.json(videos)

}catch(e){

console.log(e)

res.json([])

}

})

const PORT = process.env.PORT || 10000

app.listen(PORT,()=>{
console.log("Server running on",PORT)
})
