import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

/* ===========================
   SIMPLE PLACE KEYWORDS
=========================== */

const keywords = [
  "kahire",
  "gize",
  "mısır",
  "misir",
  "porto riko",
  "puerto rico",
  "meksika",
  "mexico",
  "istanbul",
  "san juan",
  "çin",
  "cin",
  "beijing"
];

/* ===========================
   MEMORY CACHE (important!)
=========================== */

const geoCache = {};

/* ===========================
   TEXT CLEANER
=========================== */

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ===========================
   EXTRACT PLACE NAME
=========================== */

function extractPlace(text) {
  const clean = normalize(text);

  for (const word of keywords) {
    if (clean.includes(word)) {
      return word;
    }
  }

  return null;
}

/* ===========================
   GEOCODING FUNCTION
=========================== */

async function geocode(place) {
  if (geoCache[place]) return geoCache[place];

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "travel-map-app"
    }
  });

  const data = await response.json();

  if (data && data.length > 0) {
    const result = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      location: data[0].display_name.split(",")[0]
    };

    geoCache[place] = result;
    return result;
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

    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );

    const channelData = await channelRes.json();

    const uploadsPlaylist =
      channelData.items[0].contentDetails.relatedPlaylists.uploads;

    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylist}&key=${apiKey}`
    );

    const videosData = await videosRes.json();

    const results = [];

    for (const item of videosData.items) {
      const videoId = item.snippet.resourceId.videoId;
      const title = item.snippet.title;
      const description = item.snippet.description;

      const combined = title + " " + description;

      const place = extractPlace(combined);

      if (!place) continue;

      const geo = await geocode(place);

      if (!geo) continue;

      results.push({
        id: videoId,
        lat: geo.lat,
        lng: geo.lng,
        location: geo.location
      });
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
