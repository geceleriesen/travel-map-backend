
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const xml2js = require("xml2js");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;
const CHANNEL_ID = "UCHut-IQXip7mtXyC3GOiQ1A";

const COUNTRY_MAP = {
  "mısır": "Egypt",
  "misir": "Egypt",
  "meksika": "Mexico",
  "türkiye": "Turkey",
  "turkiye": "Turkey",
  "japonya": "Japan",
  "çin": "China",
  "hindistan": "India",
  "italya": "Italy",
  "ispanya": "Spain",
  "yunanistan": "Greece",
  "almanya": "Germany",
  "fransa": "France",
  "ingiltere": "United Kingdom",
  "amerika": "United States"
};

function extractVideoId(link){
  const match = link.match(/v=([^&]+)/);
  return match ? match[1] : null;
}

function detectCountry(text){
  const lower = text.toLowerCase();
  for(const key in COUNTRY_MAP){
    if(lower.includes(key)){
      return COUNTRY_MAP[key];
    }
  }
  return null;
}

async function geocodeCountry(country){
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(country)}`;
  const res = await fetch(url, { headers: { "User-Agent": "travel-map-app" } });
  const data = await res.json();
  if(data.length > 0){
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      name: country
    };
  }
  return null;
}

app.get("/api/videos", async (req, res) => {
  try{
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const rssRes = await fetch(rssUrl);
    const xml = await rssRes.text();

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    const entries = result.feed.entry || [];
    const videos = [];

    for(const entry of entries){
      const title = entry.title[0];
      const link = entry.link[0].$.href;
      const videoId = extractVideoId(link);
      if(!videoId) continue;

      const country = detectCountry(title);
      if(!country) continue;

      const geo = await geocodeCountry(country);
      if(!geo) continue;

      videos.push({
        id: videoId,
        lat: geo.lat,
        lng: geo.lng,
        location: geo.name
      });
    }

    res.json(videos);

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Failed"});
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
