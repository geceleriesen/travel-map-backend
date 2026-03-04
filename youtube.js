import fs from "fs"

import {detectCity} from "./cityDetector.js"
import {geocode} from "./geocode.js"

const API = "https://www.googleapis.com/youtube/v3"

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

const CACHE_FILE = "./cache.json"



async function getUploadsPlaylist(){

const res = await fetch(
`${API}/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
)

const data = await res.json()

return data.items[0].contentDetails.relatedPlaylists.uploads

}



export async function getVideos(){

if(fs.existsSync(CACHE_FILE)){

console.log("using cache")

return JSON.parse(fs.readFileSync(CACHE_FILE))

}

console.log("fetching youtube videos")

const playlist = await getUploadsPlaylist()

let pageToken=""

const videos=[]

do{

const res = await fetch(
`${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&pageToken=${pageToken}&key=${API_KEY}`
)

const data = await res.json()

data.items.forEach(async v=>{

const title=v.snippet.title
const desc=v.snippet.description

const city = detectCity(title+" "+desc)

const coords = await geocode(city)

videos.push({

id:v.snippet.resourceId.videoId,
title,
location:city,
lat:coords.lat,
lng:coords.lng,
thumbnail:v.snippet.thumbnails.high.url

})

})

pageToken=data.nextPageToken

}while(pageToken)



fs.writeFileSync(CACHE_FILE,JSON.stringify(videos,null,2))

return videos

}
