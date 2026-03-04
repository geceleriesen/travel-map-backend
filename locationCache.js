import fetch from "node-fetch"
import { geocode } from "./geocode.js"

const API = "https://www.googleapis.com/youtube/v3"
const KEY = process.env.YOUTUBE_API_KEY
const CHANNEL = process.env.YOUTUBE_CHANNEL_ID

let cache = []

export function getCache() {
  return cache
}

export async function updateCache() {
  try {

    const channelRes = await fetch(
      `${API}/channels?part=contentDetails&id=${CHANNEL}&key=${KEY}`
    )

    const channelData = await channelRes.json()

    const uploads =
      channelData.items[0].contentDetails.relatedPlaylists.uploads

    let pageToken = ""
    let videos = []

    do {

      const playlistRes = await fetch(
        `${API}/playlistItems?part=snippet&playlistId=${uploads}&maxResults=50&pageToken=${pageToken}&key=${KEY}`
      )

      const playlistData = await playlistRes.json()

      playlistData.items.forEach(v => {
        videos.push({
          id: v.snippet.resourceId.videoId,
          title: v.snippet.title,
          description: v.snippet.description,
          thumbnail: v.snippet.thumbnails.high.url
        })
      })

      pageToken = playlistData.nextPageToken

    } while (pageToken)

    const results = []

    for (const video of videos) {

      const text = video.title + " " + video.description

      const geo = await geocode(text)

      if (!geo) continue

      results.push({
        id: video.id,
        lat: geo.lat,
        lng: geo.lng,
        location: geo.name,
        title: video.title,
        shortDescription: video.description.slice(0, 120),
        thumbnail: video.thumbnail
      })
    }

    cache = results

    console.log("Cache updated:", results.length, "videos")

  } catch (err) {
    console.error("Cache update error", err)
  }
}
