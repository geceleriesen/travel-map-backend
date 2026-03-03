
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const xml2js = require("xml2js");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;
const CHANNEL_ID = "UCHut-IQXip7mtXyC3GOiQ1A";

// Turkish + English country mapping
const COUNTRY_MAP = {
  "mısır": "Egypt",
  "misir": "Egypt",
  "egypt": "Egypt",

  "meksika": "Mexico",
  "mexico": "Mexico",

  "türkiye": "Turkey",
  "turkiye": "Turkey",
  "turkey": "Turkey",

  "japonya": "Japan",
  "japan": "Japan",

  "çin": "China",
  "cin": "China",
  "china": "China",

  "hindistan": "India",
  "india": "India",

  "italya": "Italy",
  "italy": "Italy",

  "ispanya": "Spain",
  "spain": "Spain",

  "yunanistan": "Greece",
  "greece": "Greece",

  "almanya": "Germany",
  "germany": "Germany",

  "fransa": "France",
  "france": "France",

  "ingiltere": "United Kingdom",
  "uk": "United Kingdom",
  "united kingdom": "United Kingdom",

  "amerika": "United States",
  "abd": "United States",
  "usa": "United States",
  "united states": "United States"
};

function normalize(text){
  return text
    .toLowerCase()
    .replace(/ç/g,"c")
    .replace(/ğ/g,"g")
    .replace(/ı/g,"i")
    .replace(/ö/g,"o")
    .replace(/ş/g,"s")
    .replace(/ü/g,"u");
}

function extractVideoId(link){
  const match = link.match(/v=([^&]+)/);
  return match ? match[1] : null;
}

function detectCountry(text){
  const normalized = normalize(text);

  for(const key in COUNTRY_MAP){
    if(normalized.includes(normalize(key))){
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

    const parser = new xml2js.Parser({ explicitArray: true });
    const result = await parser.parseStringPromise(xml);

    const entries = result.feed.entry || [];
    const videos = [];

    for(const entry of entries){

      const title = entry.title[0] || "";
      const link = entry.link[0].$.href;
      const videoId = extractVideoId(link);
      if(!videoId) continue;

      // Get description if exists
      let description = "";
      if(entry["media:group"] && entry["media:group"][0]["media:description"]){
        description = entry["media:group"][0]["media:description"][0];
      }

      const combinedText = title + " " + description;

      const country = detectCountry(combinedText);
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
