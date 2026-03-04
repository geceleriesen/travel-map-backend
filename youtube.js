import fetch from "node-fetch"

const API = "https://www.googleapis.com/youtube/v3"

export async function getChannelVideos(){

const CHANNEL = process.env.YOUTUBE_CHANNEL_ID
const KEY = process.env.YOUTUBE_API_KEY

const ch = await fetch(
`${API}/channels?part=contentDetails&id=${CHANNEL}&key=${KEY}`
)

const chData = await ch.json()

const uploads =
chData.items[0].contentDetails.relatedPlaylists.uploads

let page = ""
let videos = []

do{

const res = await fetch(
`${API}/playlistItems?part=snippet&maxResults=50&playlistId=${uploads}&pageToken=${page}&key=${KEY}`
)

const data = await res.json()

data.items.forEach(v=>{

videos.push({
id:v.snippet.resourceId.videoId,
title:v.snippet.title,
description:v.snippet.description
})

})

page = data.nextPageToken

}while(page)

return videos

}
