import fetch from "node-fetch"
import { parseStringPromise } from "xml2js"

export async function getChannelVideos(channelId){

const url =
`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`

const xml = await fetch(url).then(r=>r.text())

const data = await parseStringPromise(xml)

const entries = data.feed.entry || []

const videos=[]

for(const v of entries){

const id = v["yt:videoId"][0]
const title = v.title[0]

videos.push({
id,
title,
thumbnail:`https://img.youtube.com/vi/${id}/hqdefault.jpg`
})

}

return videos

}
