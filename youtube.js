import detectCity from "./cityDetector.js"

const API_KEY = process.env.YOUTUBE_API_KEY

const CHANNEL_ID = "UCvVqEXXv4y0FZ7X4YhY9F7Q"

async function getUploadsPlaylist(){

const url=`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`

const res = await fetch(url)

const data = await res.json()

console.log("CHANNEL RESPONSE:",data)

if(!data.items || data.items.length===0){

throw new Error("Channel not found")

}

return data.items[0].contentDetails.relatedPlaylists.uploads

}

export default async function getVideos(){

const playlistId = await getUploadsPlaylist()

let videos=[]
let nextPage=""

while(true){

const url=`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}&pageToken=${nextPage}`

const res = await fetch(url)

const data = await res.json()

console.log("PLAYLIST RESPONSE:",data)

if(!data.items) break

for(const item of data.items){

const id = item.snippet.resourceId.videoId
const title = item.snippet.title

const city = detectCity(title)

videos.push({

id,
title,
thumbnail:`https://img.youtube.com/vi/${id}/hqdefault.jpg`,
lat:city.lat,
lng:city.lng

})

}

if(!data.nextPageToken) break

nextPage=data.nextPageToken

}

console.log("VIDEOS FOUND:",videos.length)

return videos

}
