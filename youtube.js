import fetch from "node-fetch"

const API = "https://www.googleapis.com/youtube/v3"
const KEY = process.env.YOUTUBE_API_KEY
const CHANNEL = process.env.YOUTUBE_CHANNEL_ID

export async function getAllVideos() {

  const channel = await fetch(
    `${API}/channels?part=contentDetails&id=${CHANNEL}&key=${KEY}`
  ).then(r => r.json())

  const uploads =
    channel.items[0].contentDetails.relatedPlaylists.uploads

  let pageToken = ""
  let videos = []

  do {

    const res = await fetch(
      `${API}/playlistItems?part=snippet&playlistId=${uploads}&maxResults=50&pageToken=${pageToken}&key=${KEY}`
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
