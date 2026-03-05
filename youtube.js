import detectCity from "./cityDetector.js"

const PLAYLIST="UUY0fGdQ0mKk2k2gqj6b3F7A"

export default async function getVideos(){

let videos=[]
let pageToken=""

while(true){

const url=`https://www.youtube.com/playlist?list=${PLAYLIST}&pbj=1`

const res = await fetch(url)

const text = await res.text()

const ids=[...text.matchAll(/"videoId":"(.*?)"/g)]

if(!ids.length) break

for(const m of ids){

const id=m[1]

const title="YouTube Video"

const city=detectCity(title)

videos.push({

id,
title,
thumbnail:`https://img.youtube.com/vi/${id}/hqdefault.jpg`,
lat:city.lat,
lng:city.lng

})

}

break

}

return videos

}
