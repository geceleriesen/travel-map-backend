const { resolveLocation } = require("./locationAI");

const API_KEY = process.env.YOUTUBE_API_KEY;

const CHANNEL_ID = "UCHut-IQXip7mtXyC3GOiQ1A";


async function fetchChannelVideos(){

const url =
`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&type=video&order=date&key=${API_KEY}`;

const res = await fetch(url);

const data = await res.json();

return data.items.map(v=>({

id: v.id.videoId,

title: v.snippet.title,

description: v.snippet.description,

thumbnail: v.snippet.thumbnails.high.url

}));

}


async function getVideos(){

const rawVideos = await fetchChannelVideos();

const processed = rawVideos.map(v=>{

const loc = resolveLocation(v);

if(!loc){

v.location="Unknown";
v.country="Unknown";
v.lat=null;
v.lng=null;
v.locationType="unknown";

return v;

}

v.location = loc.location;
v.country = loc.country;
v.lat = loc.lat;
v.lng = loc.lng;
v.locationType = loc.type;

return v;

});

return processed;

}

module.exports = { getVideos };
