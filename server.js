import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

/* ===========================
   COUNTRY DATABASE
=========================== */

const locations = {
  "egypt": { lat: 26.8206, lng: 30.8025, tr: "Mısır" },
  "misir": { lat: 26.8206, lng: 30.8025, tr: "Mısır" },
  "kahire": { lat: 30.0444, lng: 31.2357, tr: "Mısır" },
  "gize": { lat: 29.9773, lng: 31.1325, tr: "Mısır" },

  "mexico": { lat: 23.6345, lng: -102.5528, tr: "Meksika" },
  "meksika": { lat: 23.6345, lng: -102.5528, tr: "Meksika" },

  "china": { lat: 35.8617, lng: 104.1954, tr: "Çin" },
  "cin": { lat: 35.8617, lng: 104.1954, tr: "Çin" },

  "puerto rico": { lat: 18.2208, lng: -66.5901, tr: "Porto Riko" },
  "porto riko": { lat: 18.2208, lng: -66.5901, tr: "Porto Riko" },

  "turkey": { lat: 39.9208, lng: 32.8541, tr: "Türkiye" },
  "turkiye": { lat: 39.9208, lng: 32.8541, tr: "Türkiye" },
  "istanbul": { lat: 41.0082, lng: 28.9784, tr: "Türkiye" }
};

const flagMap = {
  "🇪🇬": locations["egypt"],
  "🇲🇽": locations["mexico"],
  "🇨🇳": locations["china"],
  "🇵🇷": locations["puerto rico"],
  "🇹🇷": locations["turkey"]
};

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectLocation(text) {
  const clean = normalize(text);

  // 1️⃣ Flag detection
  for (const flag in flagMap) {
    if (text.includes(flag)) {
      return {
        lat: flagMap[flag].lat,
        lng: flagMap[flag].lng,
        location: flagMap[flag].tr
      };
    }
  }

  // 2️⃣ Keyword detection
  for (const key in locations) {
    const regex = new RegExp(`\\b${key}\\b`, "i");
    if (regex.test(clean)) {
      return {
        lat: locations[key].lat,
        lng: locations[key].lng,
        location: locations[key].tr
      };
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

    if (!apiKey || !channelId) {
      return res.status(500).json({ error: "Missing env variables" });
    }

    // 1️⃣ Get uploads playlist ID
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );

    const channelData = await channelRes.json();

    const uploadsPlaylist =
      channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 2️⃣ Get last 50 uploads
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

      const detected = detectLocation(combined);

      if (detected) {
        results.push({
          id: videoId,
          lat: detected.lat,
          lng: detected.lng,
          location: detected.location
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
