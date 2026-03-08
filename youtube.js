const { resolveLocation } = require("./locationAI");
const { resolveGeo } = require("./geoResolver");

const API_KEY = process.env.YOUTUBE_API_KEY;

const CHANNEL_ID = "UCHut-IQXip7mtXyC3GOiQ1A";


async function fetchChannelVideos(){

const url =
`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&type=video&order=date&key=${API_KEY}`;

const res = await fetch(url);

const data = await res.json();

return data.items.map(v=>({

id:v.id.videoId,
title:v.snippet.title,
description:v.snippet.description,
thumbnail:v.snippet.thumbnails.high.url

}));

}


async function fetchVideoDetails(ids){

const url =
`https://www.googleapis.com/youtube/v3/videos?part=recordingDetails&id=${ids.join(",")}&key=${API_KEY}`;

const res = await fetch(url);

const data = await res.json();

return data.items;

}


async function getVideos(){

const rawVideos=await fetchChannelVideos();

const ids=rawVideos.map(v=>v.id);

const details=await fetchVideoDetails(ids);


rawVideos.forEach(v=>{

const d=details.find(x=>x.id===v.id);

if(!d) return;

if(d.recordingDetails && d.recordingDetails.location){

v.geotag={
lat:d.recordingDetails.location.latitude,
lng:d.recordingDetails.location.longitude
};

}

});


rawVideos.forEach(v=>{

const loc=resolveLocation(v);

const finalLoc=resolveGeo(v,loc);

if(!finalLoc){

v.location="Unknown";
v.country="Unknown";
v.lat=null;
v.lng=null;
v.locationType="unknown";
return;

}

v.location=finalLoc.location;
v.country=finalLoc.country;
v.lat=finalLoc.lat;
v.lng=finalLoc.lng;
v.locationType=finalLoc.type;

});

return rawVideos;

}

module.exports={getVideos};
