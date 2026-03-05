import Parser from "rss-parser"
import detectCity from "./cityDetector.js"

const parser = new Parser()

const CHANNEL_ID = "UC6v0Y9lP3Lq6V0Kk9d0PZ1Q"

export default async function getVideos(){

const url=`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

const feed = await parser.parseURL(url)

const videos=[]

for(const item of feed.items){

const id=item.id.split(":").pop()

const city=detectCity(item.title)

videos.push({

id,
title:item.title,
thumbnail:`https://img.youtube.com/vi/${id}/hqdefault.jpg`,
lat:city.lat,
lng:city.lng

})

}

return videos

}
