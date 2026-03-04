import express from "express"
import fetch from "node-fetch"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const API = "https://www.googleapis.com/youtube/v3"
const KEY = process.env.YOUTUBE_API_KEY
const CHANNEL = process.env.YOUTUBE_CHANNEL_ID

console.log("Travel Map Engine starting...")

async function getUploadsPlaylist(){

  const url =
  `${API}/channels?part=contentDetails&id=${CHANNEL}&key=${KEY}`

  const res = await fetch(url)
  const data = await res.json()

  if(!data.items){
    console.log("YouTube API error:",data)
    return null
  }

  return data.items[0].contentDetails.relatedPlaylists.uploads
}

async function getVideos(playlist){

  const url =
  `${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&key=${KEY}`

  const res = await fetch(url)
  const data = await res.json()

  if(!data.items) return []

  return data.items.map(v => ({

    id: v.snippet.resourceId.videoId,

    title: v.snippet.title,

    thumbnail:
    "https://img.youtube.com/vi/" +
    v.snippet.resourceId.videoId +
    "/hqdefault.jpg"

  }))

}

app.get("/api/videos", async (req,res)=>{

  try{

    console.log("Fetching videos...")

    const uploads = await getUploadsPlaylist()

    if(!uploads){
      return res.json([])
    }

    const videos = await getVideos(uploads)

    const results = videos.map(v => ({

      id: v.id,

      lat: 20 + Math.random()*20,
      lng: -40 + Math.random()*80,

      location: v.title,

      thumbnail: v.thumbnail

    }))

    res.json(results)

  }
  catch(err){

    console.log("API error:",err)

    res.json([])

  }

})

app.listen(PORT,()=>{
  console.log("Travel Map running on",PORT)
})
