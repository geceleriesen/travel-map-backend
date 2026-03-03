import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

/* ===========================
   COUNTRY FALLBACK COORDS
=========================== */

const countryCenters = {
  "egypt": { lat: 26.8206, lng: 30.8025, name: "Mısır" },
  "mexico": { lat: 23.6345, lng: -102.5528, name: "Meksika" },
  "china": { lat: 35.8617, lng: 104.1954, name: "Çin" },
  "puerto rico": { lat: 18.2208, lng: -66.5901, name: "Porto Riko" },
  "turkey": { lat: 39.9208, lng: 32.8541, name: "Türkiye" }
};

function detectCountry(text) {
  const clean = text.toLowerCase();

  for (const key in countryCenters) {
    if (clean.includes(key)) {
      return countryCenters[key];
    }
  }
  return null;
}

/* ===========================
   API
=========================== */

app.get("/api/videos", async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    /* 1️⃣ Get uploads playlist */
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    const channelData = await channelRes.json();

    const uploadsPlaylist =
      channelData.items[0].contentDetails.relatedPlaylists.uploads;

    /* 2️⃣ Get latest 50 video IDs */
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylist}&key=${apiKey}`
    );
    const playlistData = await playlistRes.json();

    const videoIds = playlistData.items
      .map(item => item.snippet.resourceId.videoId)
      .join(",");

    /* 3️⃣ Get full video details */
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,recordingDetails&id=${videoIds}&key=${apiKey}`
    );
    const videosData = await videosRes.json();

    const results = [];

    for (const video of videosData.items) {
      const id = video.id;
      const title = video.snippet.title;
      const description = video.snippet.description || "";
      const thumbnail = video.snippet.thumbnails.high.url;

      /* 4️⃣ Real coordinates from YouTube */
      if (
        video.recordingDetails &&
        video.recordingDetails.location
      ) {
        results.push({
          id,
          lat: video.recordingDetails.location.latitude,
          lng: video.recordingDetails.location.longitude,
          location: video.recordingDetails.locationDescription || "Video Location",
          title,
          shortDescription: description.substring(0, 120) + "...",
          thumbnail
        });

        continue;
      }

      /* 5️⃣ Fallback to country center */
      const fallback = detectCountry(title + " " + description);

      if (fallback) {
        results.push({
          id,
          lat: fallback.lat,
          lng: fallback.lng,
          location: fallback.name,
          title,
          shortDescription: description.substring(0, 120) + "...",
          thumbnail
        });
      }
    }

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
