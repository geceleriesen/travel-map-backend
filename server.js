import express from "express"
import cors from "cors"
import fs from "fs"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const API="https://www.googleapis.com/youtube/v3"

const API_KEY=process.env.YOUTUBE_API_KEY
const CHANNEL_ID=process.env.YOUTUBE_CHANNEL_ID

const cities = JSON.parse(fs.readFileSync("./cities.json"))

const CACHE="./cache.json"



/* AI CITY EXTRACTION */

function extractCity(text){

text=text.toLowerCase()

for(const city of cities){

if(text.includes(city.name.toLowerCase())){

return city

}

}

return null

}



/* GEOCODE FALLBACK */

async function geocode(query){

try{

const res = await fetch(
`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
)

const data = await res.json()

if(data.length){

return {
lat:parseFloat(data[0].lat),
lng:parseFloat(data[0].lon)
}

}

}catch(e){}

return null

}



/* RANDOM FALLBACK */

function randomLocation(){

return{
lat:20+(Math.random()*60-30),
lng:(Math.random()*120-60)
}

}



/* GET UPLOAD PLAYLIST */

async function getPlaylist(){

const res = await fetch(
`${API}/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
)

const data = await res.json()

return data.items[0].contentDetails.relatedPlaylists.uploads

}



/* FETCH ALL VIDEOS */

async function fetchVideos(){

const playlist = await getPlaylist()

let pageToken=""
const videos=[]

do{

const res = await fetch(
`${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&pageToken=${pageToken}&key=${API_KEY}`
)

const data = await res.json()

data.items.forEach(v=>{

videos.push({
id:v.snippet.resourceId.videoId,
title:v.snippet.title,
description:v.snippet.description,
thumbnail:v.snippet.thumbnails.high.url
})

})

pageToken=data.nextPageToken

}while(pageToken)



const mapped=[]

for(const v of videos){

let loc = extractCity(v.title+" "+v.description)

if(!loc){

loc = await geocode(v.title)

}

if(!loc){

loc = randomLocation()

}

mapped.push({

id:v.id,
title:v.title,
thumbnail:v.thumbnail,

lat:loc.lat,
lng:loc.lng

})

}



fs.writeFileSync(CACHE,JSON.stringify(mapped,null,2))

return mapped

}



/* API */

app.get("/api/videos", async(req,res)=>{

try{

if(fs.existsSync(CACHE)){

return res.json(JSON.parse(fs.readFileSync(CACHE)))

}

const vids = await fetchVideos()

res.json(vids)

}catch(e){

console.log(e)
res.json([])

}

})



/* CACHE REFRESH */

app.get("/refresh", async(req,res)=>{

const vids = await fetchVideos()

res.json({
status:"refreshed",
videos:vids.length
})

})



app.listen(PORT,()=>{

console.log("Travel Map Engine running")

})
