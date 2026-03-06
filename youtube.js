import locationAI from "./locationAI.js"

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = "UCHut-IQXip7mtXyC3GOiQ1A"

async function getUploadsPlaylist(){

const url =
"https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id="
+ CHANNEL_ID +
"&key=" + API_KEY

const res = await fetch(url)

const data = await res.json()

if(!data.items || data.items.length === 0){

console.log("Channel not found")

return null

}

return data.items[0].contentDetails.relatedPlaylists.uploads

}

export default async function getVideos(){

const playlistId = await getUploadsPlaylist()

if(!playlistId) return []

let videos=[]
let nextPage=""

while(true){

const url =
"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet"
+"&playlistId="+playlistId
+"&maxResults=50"
+"&key="+API_KEY
+"&pageToken="+nextPage

const res = await fetch(url)

const data = await res.json()

if(!data.items) break

for(const item of data.items){

if(!item.snippet) continue

const id = item.snippet.resourceId.videoId
const title = item.snippet.title

const loc = locationAI(title)

videos.push({

id:id,
title:title,
thumbnail:"https://img.youtube.com/vi/"+id+"/hqdefault.jpg",

lat:loc.lat,
lng:loc.lng,
location:loc.name

})

}

if(!data.nextPageToken) break

nextPage = data.nextPageToken

}

console.log("VIDEOS FOUND:",videos.length)

return videos

}
