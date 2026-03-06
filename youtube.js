// youtube.js

const {resolveLocation}=require("./locationAI");

function processVideos(videos){

return videos.map(v=>{

const loc=resolveLocation(v);

if(!loc){

v.location="Unknown";
v.lat=null;
v.lng=null;
v.locationType="unknown";

return v;

}

v.location=loc.location;
v.country=loc.country;
v.lat=loc.lat;
v.lng=loc.lng;
v.locationType=loc.type;

return v;

});

}

module.exports={processVideos};
