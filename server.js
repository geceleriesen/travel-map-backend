import express from "express"
import cors from "cors"
import getVideos from "./youtube.js"

const app = express()

app.use(cors())

let cache=null

app.get("/",(req,res)=>{
res.send("Travel Map API running")
})

app.get("/api/videos", async (req,res)=>{

try{

if(cache){
return res.json(cache)
}

const videos = await getVideos()

cache = videos

setTimeout(()=>{
cache=null
},1000*60*30)

res.json(videos)

}catch(e){

console.log(e)
res.json([])

}

})

const PORT = process.env.PORT || 10000

app.listen(PORT,()=>{
console.log("Server running",PORT)
})
