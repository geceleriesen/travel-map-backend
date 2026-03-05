import detectCity from "./cityDetector.js"

const PLAYLIST = "UUY0fGdQ0mKk2k2gqj6b3F7A"

export default async function getVideos(){

const url=`https://www.youtube.com/playlist?list=${PLAYLIST}`

const html = await fetch(url).then(r=>r.text())

const matches=[...html.matchAll(/"videoId":"(.*?)"/g)]

const videos=[]

for(const m of matches){

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

return videos

}
