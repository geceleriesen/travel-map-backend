import locationAI from "./locationAI.js"

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = "UCHut-IQXip7mtXyC3GOiQ1A"

async function getUploadsPlaylist(){

const url =
"https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id="
+ CHANNEL_ID +
"&key=" + API_KEY

const res = await fetch(url)
const data = await res.json()

return data.items[0].contentDetails.relatedPlaylists.uploads
}

export default async function getVideos(){

const playlistId = await getUploadsPlaylist()

let videos=[]
let nextPage=""

while(true){

const url =
"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet"
+"&playlistId="+playlistId
+"&maxResults=50"
+"&key="+API_KEY
+"&pageToken="+nextPage

const res = await fetch(url)
const data = await res.json()

if(!data.items) break

for(const item of data.items){

const id = item.snippet.resourceId.videoId
const title = item.snippet.title

const loc = locationAI(title)

// eğer AI bulamazsa bile boş obje dönmesin

videos.push({

id:id,

title:title,

thumbnail:"https://img.youtube.com/vi/"+id+"/hqdefault.jpg",

lat:loc?.lat ?? null,
lng:loc?.lng ?? null,
location:loc?.name ?? "Unknown"

})

}

if(!data.nextPageToken) break
nextPage=data.nextPageToken

}

console.log("VIDEOS FOUND:",videos.length)

return videos

}
