import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

const countries = {
  "egypt": { lat: 26.8206, lng: 30.8025 },
  "misir": { lat: 26.8206, lng: 30.8025 },

  "china": { lat: 35.8617, lng: 104.1954 },
  "cin": { lat: 35.8617, lng: 104.1954 },

  "mexico": { lat: 23.6345, lng: -102.5528 },
  "meksika": { lat: 23.6345, lng: -102.5528 },

  "puerto rico": { lat: 18.2208, lng: -66.5901 },
  "porto riko": { lat: 18.2208, lng: -66.5901 }
};

const countryNamesTR = {
  "egypt": "Mısır",
  "misir": "Mısır",

  "china": "Çin",
  "cin": "Çin",

  "mexico": "Meksika",
  "meksika": "Meksika",

  "puerto rico": "Porto Riko",
  "porto riko": "Porto Riko"
};

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectCountry(text) {
  const clean = normalize(text);

  for (const name in countries) {
    const regex = new RegExp(`\\b${name}\\b`, "i");
    if (regex.test(clean)) {
      return {
        lat: countries[name].lat,
        lng: countries[name].lng,
        location: countryNamesTR[name] || name
      };
    }
  }

  return null;
}

app.get("/api/videos", async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=20`;

    const response = await fetch(url);
    const data = await response.json();

    const results = [];

    data.items.forEach(video => {
      if (!video.id.videoId) return;

      const text = video.snippet.title + " " + video.snippet.description;
      const detected = detectCountry(text);

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
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
