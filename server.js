import express from "express"
import cors from "cors"
import fetch from "node-fetch"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

async function getUploadsPlaylist(){

const url =
`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`

const res = await fetch(url)
const data = await res.json()

console.log("CHANNEL DATA:", data)

return data.items[0].contentDetails.relatedPlaylists.uploads

}

async function getVideos(){

const playlist = await getUploadsPlaylist()

let pageToken = ""
let videos = []

do{

const url =
`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&pageToken=${pageToken}&key=${API_KEY}`

const res = await fetch(url)
const data = await res.json()

console.log("PLAYLIST DATA:", data)

for(const item of data.items){

videos.push({
id:item.snippet.resourceId.videoId,
title:item.snippet.title,
thumbnail:item.snippet.thumbnails.high.url,
lat:0,
lng:0
})

}

pageToken = data.nextPageToken

}while(pageToken)

return videos

}

app.get("/api/videos", async(req,res)=>{

try{

const videos = await getVideos()

res.json(videos)

}catch(e){

console.log("ERROR:", e)
res.json([])

}

})

app.listen(PORT,()=>{
console.log("SERVER RUNNING")
})
