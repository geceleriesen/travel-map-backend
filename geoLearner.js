// geoLearner.js

const fs=require("fs");

const CACHE_FILE="geoCache.json";

let cache={};

function loadCache(){

if(fs.existsSync(CACHE_FILE)){
cache=JSON.parse(fs.readFileSync(CACHE_FILE));
}

}

function saveCache(){
fs.writeFileSync(CACHE_FILE,JSON.stringify(cache,null,2));
}

function learnLocation(video,location){

if(!location) return;

cache[video.id]=location;

saveCache();

}

function getLearnedLocation(video){

return cache[video.id]||null;

}

module.exports={
loadCache,
learnLocation,
getLearnedLocation
};
