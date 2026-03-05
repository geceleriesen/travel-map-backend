import fetch from "node-fetch"
import {parseStringPromise} from "xml2js"

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

export async function getVideosFromRSS(){

const url =
`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

const xml = await fetch(url).then(r=>r.text())

const data = await parseStringPromise(xml)

const entries = data.feed.entry || []

const videos=[]

for(const e of entries){

const id = e["yt:videoId"][0]
const title = e.title[0]

videos.push({
id,
title,
thumbnail:`https://img.youtube.com/vi/${id}/hqdefault.jpg`
})

}

return videos

}
