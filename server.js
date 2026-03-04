import express from "express"
import fetch from "node-fetch"
import cors from "cors"
import dotenv from "dotenv"

import {extractPlaces} from "./locationAI.js"
import {matchCity} from "./cityMatcher.js"

dotenv.config()

const app = express()
app.use(cors())

const API = "https://www.googleapis.com/youtube/v3"
const KEY = process.env.YOUTUBE_API_KEY
const CHANNEL = process.env.YOUTUBE_CHANNEL_ID

let cache = []

async function getUploads(){

const res = await fetch(
`${API}/channels?part=contentDetails&id=${CHANNEL}&key=${KEY}`
)

const data = await res.json()

return data.items[0].contentDetails.relatedPlaylists.uploads

}

async function getVideos(playlist){

let token=""
const videos=[]

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

token=data.nextPageToken

}while(token)

return videos

}

async function buildMap(){

const uploads = await getUploads()

const videos = await getVideos(uploads)

const results=[]

for(const v of videos){

const text = v.title + " " + v.description

const places = extractPlaces(text)

const city = matchCity(places)

let lat=20
let lng=0
let name="Unknown"

if(city){

lat = city.lat
lng = city.lng
name = city.name

}

results.push({

id:v.id,
lat,
lng,
location:name,
title:v.title,
thumbnail:`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

})

}

cache = results

console.log("Videos mapped:",results.length)

}

app.get("/api/videos",(req,res)=>{

res.json(cache)

})

app.listen(10000,async()=>{

console.log("Travel Map Engine running")

await buildMap()

})
