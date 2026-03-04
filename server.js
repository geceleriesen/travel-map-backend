import express from "express"
import cors from "cors"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const API = "https://www.googleapis.com/youtube/v3"

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID



async function getUploadsPlaylist(){

const url =
`${API}/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`

const res = await fetch(url)
const data = await res.json()

if(data.error){
console.log("CHANNEL ERROR:",data.error)
return null
}

if(!data.items || data.items.length === 0){
console.log("CHANNEL EMPTY")
return null
}

return data.items[0].contentDetails.relatedPlaylists.uploads
}



async function fetchVideos(){

const playlist = await getUploadsPlaylist()

if(!playlist){
console.log("PLAYLIST NOT FOUND")
return []
}

let pageToken=""
const videos=[]

do{

const url =
`${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&pageToken=${pageToken}&key=${API_KEY}`

const res = await fetch(url)
const data = await res.json()

if(data.error){
console.log("YOUTUBE ERROR:",data.error)
break
}

if(!data.items){
console.log("NO ITEMS RETURNED")
break
}

for(const v of data.items){

videos.push({

id: v.snippet.resourceId.videoId,

title: v.snippet.title,

thumbnail: v.snippet.thumbnails.high.url,

lat: 20 + (Math.random()*40-20),

lng: Math.random()*120-60

})

}

pageToken = data.nextPageToken

}while(pageToken)

console.log("VIDEOS FOUND:",videos.length)

return videos

}



app.get("/api/videos", async(req,res)=>{

try{

const vids = await fetchVideos()

res.json(vids)

}catch(err){

console.log("SERVER ERROR:",err)

res.json([])

}

})



app.listen(PORT,()=>{
console.log("Travel backend running")
})
