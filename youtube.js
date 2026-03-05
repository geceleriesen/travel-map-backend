import fetch from "node-fetch"

const API="https://www.googleapis.com/youtube/v3"

const API_KEY=process.env.YOUTUBE_API_KEY
const CHANNEL_ID=process.env.YOUTUBE_CHANNEL_ID



async function getUploadsPlaylist(){

const url =
`${API}/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`

const res=await fetch(url)
const data=await res.json()

return data.items[0].contentDetails.relatedPlaylists.uploads

}



export async function getAllVideos(){

const playlist=await getUploadsPlaylist()

let pageToken=""
let videos=[]

do{

const url =
`${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&pageToken=${pageToken}&key=${API_KEY}`

const res=await fetch(url)
const data=await res.json()

for(const item of data.items){

videos.push({

id:item.snippet.resourceId.videoId,
title:item.snippet.title,
thumbnail:item.snippet.thumbnails.high.url

})

}

pageToken=data.nextPageToken

}while(pageToken)

return videos

}
