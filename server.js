import express from "express"
import fetch from "node-fetch"
import cors from "cors"
import dotenv from "dotenv"
import cities from "./cities.json" assert { type: "json" }

dotenv.config()

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const API = "https://www.googleapis.com/youtube/v3"
const KEY = process.env.YOUTUBE_API_KEY
const CHANNEL = process.env.YOUTUBE_CHANNEL_ID


function findCity(text){

const clean = text.toLowerCase()

for(const city of cities){

if(clean.includes(city.name.toLowerCase())){

return {
lat: city.lat,
lng: city.lng,
name: city.name
}

}

}

return null

}


async function getUploadsPlaylist(){

const res = await fetch(
`${API}/channels?part=contentDetails&id=${CHANNEL}&key=${KEY}`
)

const data = await res.json()

return data.items[0].contentDetails.relatedPlaylists.uploads

}



async function getVideos(playlist){

let token = ""
const videos = []

do{

const res = await fetch(
`${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&pageToken=${token}&key=${KEY}`
)

const data = await res.json()

data.items.forEach(v=>{

videos.push({
id:v.snippet.resourceId.videoId,
title:v.snippet.title,
description:v.snippet.description
})

})

token = data.nextPageToken

}while(token)

return videos

}



app.get("/api/videos", async (req,res)=>{

try{

const uploads = await getUploadsPlaylist()
const videos = await getVideos(uploads)

const results = []

for(const v of videos){

const text = v.title + " " + v.description

let location = findCity(text)

if(!location){

location = {
lat:20,
lng:0,
name:"Unknown"
}

}

results.push({

id:v.id,
lat:location.lat,
lng:location.lng,
location:location.name,
title:v.title,
thumbnail:`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

})

}

res.json(results)

}
catch(e){

console.log(e)
res.json([])

}

})


app.listen(PORT,()=>{
console.log("Travel map running")
})
