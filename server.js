import express from "express"
import cors from "cors"
import getVideos from "./rss.js"
import cache from "./cache.js"

const app = express()

app.use(cors())

app.get("/", (req,res)=>{
res.send("Travel Map AI running")
})

app.get("/api/videos", async (req,res)=>{

try{

if(cache.data){
return res.json(cache.data)
}

const videos = await getVideos()

cache.data = videos

setTimeout(()=>{
cache.data=null
},1000*60*30)

res.json(videos)

}catch(e){

console.log(e)

res.json([])

}

})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
console.log("Server running",PORT)
})
