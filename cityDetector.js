import detectCity from "./cityDetector.js"

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = "UC6v0Y9lP3Lq6V0Kk9d0PZ1Q"

export default async function getVideos(){

let videos=[]
let nextPage=""

while(true){

const url=`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&pageToken=${nextPage}`

const res=await fetch(url)
const data=await res.json()

for(const item of data.items){

if(item.id.kind!=="youtube#video") continue

const id=item.id.videoId
const title=item.snippet.title

const city=detectCity(title)

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

return videos

}
