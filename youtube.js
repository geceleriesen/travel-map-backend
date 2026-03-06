import detectCity from "./cityDetector.js"

const API_KEY = process.env.YOUTUBE_API_KEY

const CHANNEL_ID = "UC0p5p9C6TQ6J9o7y1yZ0B2A"

export default async function getVideos(){

if(!API_KEY){
console.log("NO API KEY")
return []
}

let videos=[]
let nextPage=""

while(true){

const url=`https://www.googleapis.com/youtube/v3/search?part=snippet,id&type=video&channelId=${CHANNEL_ID}&maxResults=50&key=${API_KEY}&pageToken=${nextPage}`

const res = await fetch(url)

const data = await res.json()

console.log("YT RESPONSE:",data)

if(!data.items) break

for(const item of data.items){

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
