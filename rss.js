import Parser from "rss-parser"
import locate from "./aiLocator.js"

const parser = new Parser()

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

export default async function getVideos(){

const feed = await parser.parseURL(
`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
)

const videos=[]

for(const item of feed.items){

const id=item.id.split(":").pop()

const loc = await locate(item.title)

videos.push({

id:id,
title:item.title,
thumbnail:`https://img.youtube.com/vi/${id}/hqdefault.jpg`,
lat:loc.lat,
lng:loc.lng

})

}

return videos

}
