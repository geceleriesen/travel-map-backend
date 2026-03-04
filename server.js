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

const countryCenters = {
  turkey: { lat: 39.92, lng: 32.85, name: "Türkiye" },
  egypt: { lat: 26.82, lng: 30.80, name: "Mısır" },
  mexico: { lat: 23.63, lng: -102.55, name: "Meksika" },
  china: { lat: 35.86, lng: 104.19, name: "Çin" },
  "puerto rico": { lat: 18.22, lng: -66.59, name: "Porto Riko" }
}

function detectCountry(text) {
  const clean = text.toLowerCase()

  for (const key in countryCenters) {
    if (clean.includes(key)) return countryCenters[key]
  }

  return null
}

async function getUploadsPlaylist() {
  const res = await fetch(
    `${API}/channels?part=contentDetails&id=${CHANNEL}&key=${KEY}`
  )

  const data = await res.json()

  return data.items[0].contentDetails.relatedPlaylists.uploads
}

async function getAllVideos(playlistId) {

  let pageToken = ""
  let videos = []

  do {

    const res = await fetch(
      `${API}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${pageToken}&key=${KEY}`
    )

    const data = await res.json()

    data.items.forEach(v => {
      videos.push({
        id: v.snippet.resourceId.videoId,
        title: v.snippet.title,
        description: v.snippet.description,
        thumbnail: v.snippet.thumbnails.high.url
      })
    })

    pageToken = data.nextPageToken

  } while (pageToken)

  return videos
}

async function getVideoLocations(videoIds) {

  const res = await fetch(
    `${API}/videos?part=recordingDetails&id=${videoIds.join(",")}&key=${KEY}`
  )

  const data = await res.json()

  const locations = {}

  data.items.forEach(v => {
    if (v.recordingDetails?.location) {
      locations[v.id] = {
        lat: v.recordingDetails.location.latitude,
        lng: v.recordingDetails.location.longitude,
        name: v.recordingDetails.locationDescription || "Video Location"
      }
    }
  })

  return locations
}

app.get("/api/videos", async (req, res) => {

  try {

    const uploads = await getUploadsPlaylist()

    const videos = await getAllVideos(uploads)

    const ids = videos.map(v => v.id)

    const locations = await getVideoLocations(ids)

    const results = videos.map(video => {

      const text = video.title + " " + video.description

      if (locations[video.id]) {

        return {
          ...video,
          lat: locations[video.id].lat,
          lng: locations[video.id].lng,
          location: locations[video.id].name
        }
      }

      const fallback = detectCountry(text)

      if (fallback) {
        return {
          ...video,
          lat: fallback.lat,
          lng: fallback.lng,
          location: fallback.name
        }
      }

      return {
        ...video,
        lat: 0,
        lng: 0,
        location: "Unknown"
      }

    })

    res.json(results)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }

})

app.listen(PORT, () => {
  console.log("Travel map API running on", PORT)
})
