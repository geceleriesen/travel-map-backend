import fetch from "node-fetch"

const API="https://www.googleapis.com/youtube/v3"

export async function getChannelVideos(){

let page=""
let videos=[]

do{

const res = await fetch(

`${API}/search?key=${process.env.YOUTUBE_API_KEY}
&channelId=${process.env.YOUTUBE_CHANNEL_ID}
&part=snippet,id
&type=video
&maxResults=50
&pageToken=${page}`

)

const data = await res.json()

data.items.forEach(v=>{

videos.push({

id:v.id.videoId,
title:v.snippet.title,
description:v.snippet.description

})

})

page=data.nextPageToken

}while(page)

return videos

}
