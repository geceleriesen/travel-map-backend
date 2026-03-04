import express from "express"
import fetch from "node-fetch"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const API = "https://www.googleapis.com/youtube/v3"
const KEY = process.env.YOUTUBE_API_KEY
const CHANNEL = process.env.YOUTUBE_CHANNEL_ID


const cities = {

"porto riko": {lat:18.2208,lng:-66.5901,name:"Puerto Rico"},
"puerto rico": {lat:18.2208,lng:-66.5901,name:"Puerto Rico"},
"san juan": {lat:18.4655,lng:-66.1057,name:"San Juan"},

"mexico": {lat:23.6345,lng:-102.5528,name:"Mexico"},
"meksika": {lat:23.6345,lng:-102.5528,name:"Mexico"},

"cairo": {lat:30.0444,lng:31.2357,name:"Cairo"},
"kahire": {lat:30.0444,lng:31.2357,name:"Cairo"},
"giza": {lat:29.9773,lng:31.1325,name:"Giza"},

"medine": {lat:24.5247,lng:39.5692,name:"Medina"},
"mekke": {lat:21.3891,lng:39.8579,name:"Mecca"},
"riyad": {lat:24.7136,lng:46.6753,name:"Riyadh"},

"istanbul": {lat:41.0082,lng:28.9784,name:"Istanbul"},
"paris": {lat:48.8566,lng:2.3522,name:"Paris"},
"rome": {lat:41.9028,lng:12.4964,name:"Rome"}

}


function detectLocation(text){

const clean = text.toLowerCase()

for(const city in cities){

if(clean.includes(city)){
return cities[city]
}

}

return null

}


async function getUploadsPlaylist(){

const url =
`${API}/channels?part=contentDetails&id=${CHANNEL}&key=${KEY}`

const res = await fetch(url)
const data = await res.json()

return data.items[0].contentDetails.relatedPlaylists.uploads

}



async function getVideos(playlist){

let pageToken = ""
const videos = []

do{

const url =
`${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&pageToken=${pageToken}&key=${KEY}`

const res = await fetch(url)
const data = await res.json()

data.items.forEach(v=>{

videos.push({

id: v.snippet.resourceId.videoId,
title: v.snippet.title,
description: v.snippet.description

})

})

pageToken = data.nextPageToken

}while(pageToken)

return videos

}



app.get("/api/videos", async (req,res)=>{

try{

const uploads = await getUploadsPlaylist()
const videos = await getVideos(uploads)

const results = []

for(const v of videos){

const text = v.title + " " + v.description

let lat = 20
let lng = 0
let location = "Unknown"

const found = detectLocation(text)

if(found){
lat = found.lat
lng = found.lng
location = found.name
}

results.push({

id: v.id,
lat,
lng,
location,
title: v.title,
thumbnail:
"https://img.youtube.com/vi/"+v.id+"/hqdefault.jpg"

})

}

res.json(results)

}
catch(err){

console.log(err)
res.json([])

}

})


app.listen(PORT,()=>{

console.log("Travel Map running on",PORT)

})
