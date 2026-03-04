import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

const API = "https://www.googleapis.com/youtube/v3";
const KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL = process.env.YOUTUBE_CHANNEL_ID;

// basit yer tespiti
const places = [
  "istanbul","ankara","izmir",
  "cairo","giza","egypt",
  "mexico","cancun",
  "puerto rico","porto rico","san juan",
  "tokyo","beijing","shanghai",
  "paris","rome","barcelona","madrid",
  "dubai","bangkok","bali"
];

// fallback koordinatlar
const fallbackCoords = {
  "istanbul": {lat:41.0082,lng:28.9784,name:"Istanbul"},
  "cairo": {lat:30.0444,lng:31.2357,name:"Cairo"},
  "giza": {lat:29.9773,lng:31.1325,name:"Giza"},
  "mexico": {lat:23.6345,lng:-102.5528,name:"Mexico"},
  "san juan": {lat:18.4655,lng:-66.1057,name:"San Juan"},
  "puerto rico": {lat:18.2208,lng:-66.5901,name:"Puerto Rico"},
  "tokyo": {lat:35.6762,lng:139.6503,name:"Tokyo"},
  "paris": {lat:48.8566,lng:2.3522,name:"Paris"},
  "rome": {lat:41.9028,lng:12.4964,name:"Rome"}
};

function detectPlace(text){
  const clean = text.toLowerCase();
  for(const p of places){
    if(clean.includes(p)) return p;
  }
  return null;
}

async function getUploadsPlaylist(){
  const res = await fetch(
    `${API}/channels?part=contentDetails&id=${CHANNEL}&key=${KEY}`
  );
  const data = await res.json();
  return data.items[0].contentDetails.relatedPlaylists.uploads;
}

async function getAllVideos(playlistId){

  let pageToken = "";
  const videos = [];

  do{

    const res = await fetch(
      `${API}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${pageToken}&key=${KEY}`
    );

    const data = await res.json();

    data.items.forEach(v=>{
      videos.push({
        id: v.snippet.resourceId.videoId,
        title: v.snippet.title,
        description: v.snippet.description,
        thumbnail: v.snippet.thumbnails.high.url
      });
    });

    pageToken = data.nextPageToken;

  }while(pageToken);

  return videos;
}

app.get("/api/videos", async (req,res)=>{

  try{

    const uploads = await getUploadsPlaylist();
    const videos = await getAllVideos(uploads);

    const results = [];

    for(const v of videos){

      const text = v.title + " " + v.description;

      let lat = 20;
      let lng = 0;
      let location = "Unknown";

      const place = detectPlace(text);

      if(place && fallbackCoords[place]){
        lat = fallbackCoords[place].lat;
        lng = fallbackCoords[place].lng;
        location = fallbackCoords[place].name;
      }

      results.push({
        id: v.id,
        lat,
        lng,
        location,
        title: v.title,
        shortDescription: v.description.slice(0,120),
        thumbnail: v.thumbnail
      });

    }

    res.json(results);

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error"});
  }

});

app.listen(PORT, ()=>{
  console.log("Travel map backend running on", PORT);
});
