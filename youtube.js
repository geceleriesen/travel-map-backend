import fetch from "node-fetch"

const API = "https://www.googleapis.com/youtube/v3"

const KEY = process.env.YOUTUBE_API_KEY
const CHANNEL = process.env.YOUTUBE_CHANNEL_ID

async function getUploadsPlaylist(){

const url =
`${API}/channels?part=contentDetails&id=${CHANNEL}&key=${KEY}`

const res = await fetch(url)

const data = await res.json()

return data.items[0].contentDetails.relatedPlaylists.uploads

}

async function getPlaylistVideos(playlist){

let pageToken = ""

const videos = []

do{

const url =
`${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&pageToken=${pageToken}&key=${KEY}`

const res = await fetch(url)

const data = await res.json()

data.items.forEach(v => {

videos.push({

id: v.snippet.resourceId.videoId,
title: v.snippet.title

})

})

pageToken = data.nextPageToken

}while(pageToken)

return videos

}

export async function getAllVideos(){

const uploads = await getUploadsPlaylist()

return await getPlaylistVideos(uploads)

}
