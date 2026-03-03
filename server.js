import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

/* ===========================
   COUNTRY + CITY DATABASE
=========================== */

const locations = {
  // EGYPT
  "egypt": { lat: 26.8206, lng: 30.8025, tr: "Mısır" },
  "misir": { lat: 26.8206, lng: 30.8025, tr: "Mısır" },
  "kahire": { lat: 30.0444, lng: 31.2357, tr: "Mısır" },
  "gize": { lat: 29.9773, lng: 31.1325, tr: "Mısır" },

  // MEXICO
  "mexico": { lat: 23.6345, lng: -102.5528, tr: "Meksika" },
  "meksika": { lat: 23.6345, lng: -102.5528, tr: "Meksika" },
  "cancun": { lat: 21.1619, lng: -86.8515, tr: "Meksika" },

  // CHINA
  "china": { lat: 35.8617, lng: 104.1954, tr: "Çin" },
  "cin": { lat: 35.8617, lng: 104.1954, tr: "Çin" },
  "beijing": { lat: 39.9042, lng: 116.4074, tr: "Çin" },

  // PUERTO RICO
  "puerto rico": { lat: 18.2208, lng: -66.5901, tr: "Porto Riko" },
  "porto riko": { lat: 18.2208, lng: -66.5901, tr: "Porto Riko" },
  "san juan": { lat: 18.4655, lng: -66.1057, tr: "Porto Riko" },

  // TURKEY
  "turkey": { lat: 39.9208, lng: 32.8541, tr: "Türkiye" },
  "turkiye": { lat: 39.9208, lng: 32.8541, tr: "Türkiye" },
  "istanbul": { lat: 41.0082, lng: 28.9784, tr: "Türkiye" }
};

/* ===========================
   TEXT NORMALIZER
=========================== */

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ===========================
   LOCATION DETECTOR
=========================== */

function detectLocation(text) {
  const clean = normalize(text);

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
   API ENDPOINT
=========================== */

app.get("/api/videos", async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) {
      return res.status(500).json({ error: "Missing environment variables" });
    }

    const url =
      `https://www.googleapis.com/youtube/v3/search?` +
      `key=${apiKey}` +
      `&channelId=${channelId}` +
      `&part=snippet,id` +
      `&order=date` +
      `&maxResults=50`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) {
      return res.json([]);
    }

    const results = [];

    data.items.forEach(video => {
      if (!video.id.videoId) return;

      const combinedText =
        video.snippet.title + " " + video.snippet.description;

      const detected = detectLocation(combinedText);

      if (detected) {
        results.push({
          id: video.id.videoId,
          lat: detected.lat,
          lng: detected.lng,
          location: detected.location
        });
      }
    });

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ===========================
   START SERVER
=========================== */

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
