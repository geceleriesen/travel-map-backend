
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const xml2js = require("xml2js");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;
const CHANNEL_ID = "UCHut-IQXip7mtXyC3GOiQ1A";

// Country center coordinates (NO external API calls)
const COUNTRY_DB = {
  "Egypt": { lat: 26.8206, lng: 30.8025 },
  "Mexico": { lat: 23.6345, lng: -102.5528 },
  "Turkey": { lat: 38.9637, lng: 35.2433 },
  "Japan": { lat: 36.2048, lng: 138.2529 },
  "China": { lat: 35.8617, lng: 104.1954 },
  "India": { lat: 20.5937, lng: 78.9629 },
  "Italy": { lat: 41.8719, lng: 12.5674 },
  "Spain": { lat: 40.4637, lng: -3.7492 },
  "Greece": { lat: 39.0742, lng: 21.8243 },
  "Germany": { lat: 51.1657, lng: 10.4515 },
  "France": { lat: 46.2276, lng: 2.2137 },
  "United Kingdom": { lat: 55.3781, lng: -3.4360 },
  "United States": { lat: 37.0902, lng: -95.7129 }
};

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

      let description = "";
      if(entry["media:group"] && entry["media:group"][0]["media:description"]){
        description = entry["media:group"][0]["media:description"][0];
      }

      const combinedText = title + " " + description;

      const country = detectCountry(combinedText);
      if(!country) continue;

      const coords = COUNTRY_DB[country];
      if(!coords) continue;

      videos.push({
        id: videoId,
        lat: coords.lat,
        lng: coords.lng,
        location: country
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
