import express from "express"
import cors from "cors"

const app = express()
app.use(cors())

const API = "https://www.googleapis.com/youtube/v3"
const PORT = process.env.PORT || 10000

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

/* 1️⃣ Kanalın uploads playlist ID'sini al */

async function getUploadsPlaylist() {

  const res = await fetch(
    `${API}/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
  )

  const data = await res.json()

  if (!data.items || !data.items.length) {
    console.log("CHANNEL ERROR:", data)
    return null
  }

  return data.items[0].contentDetails.relatedPlaylists.uploads
}


/* 2️⃣ Playlistten tüm videoları çek */

async function getAllVideos() {

  const playlistId = await getUploadsPlaylist()

  if (!playlistId) return []

  let pageToken = ""
  const videos = []

  do {

    const res = await fetch(
      `${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${pageToken}&key=${API_KEY}`
    )

    const data = await res.json()

    if (!data.items) {
      console.log("PLAYLIST ERROR:", data)
      break
    }

    data.items.forEach(v => {

      videos.push({
        id: v.snippet.resourceId.videoId,
        title: v.snippet.title,
        thumbnail: v.snippet.thumbnails.high.url
      })

    })

    pageToken = data.nextPageToken

  } while (pageToken)

  return videos
}


/* 3️⃣ API endpoint */

app.get("/api/videos", async (req, res) => {

  const vids = await getAllVideos()

  const mapped = vids.map(v => ({
    ...v,
    lat: 20 + (Math.random()*60 - 30),
    lng: (Math.random()*120 - 60)
  }))

  res.json(mapped)

})


app.get("/", (req,res) => {
  res.send("Travel backend running")
})


app.listen(PORT, () => {
  console.log("Server started")
})
