import express from "express"
import cors from "cors"

const app = express()

app.use(cors())

const PORT = process.env.PORT || 10000


const CHANNEL =
"https://www.youtube.com/@YOUR_CHANNEL/videos"



function randomLocation(){

return {

lat:20 + (Math.random()*60 - 30),

lng:(Math.random()*120 - 60)

}

}


async function getVideos(){

const res = await fetch(CHANNEL)

const html = await res.text()


const ids = [...html.matchAll(/"videoId":"(.*?)"/g)]

const unique = [...new Set(ids.map(i=>i[1]))]


const videos = unique.map(id=>{

const loc = randomLocation()

return {

id,

title:"YouTube Video",

thumbnail:`https://img.youtube.com/vi/${id}/hqdefault.jpg`,

lat:loc.lat,

lng:loc.lng

}

})


return videos

}



app.get("/api/videos", async (req,res)=>{

try{

const videos = await getVideos()

res.json(videos)

}catch(e){

console.log(e)

res.json([])

}

})


app.listen(PORT,()=>{

console.log("Travel backend running")

})
