// locationAI.js

const { detectCity } = require("./cityDetector");
const { detectCountry } = require("./countries");
const { normalizeTurkish } = require("./turkishNormalizer");

const landmarks = {

"eiffel tower":{lat:48.8584,lng:2.2945,city:"Paris",country:"France"},
"burj khalifa":{lat:25.1972,lng:55.2744,city:"Dubai",country:"UAE"},
"taj mahal":{lat:27.1751,lng:78.0421,city:"Agra",country:"India"},
"colosseum":{lat:41.8902,lng:12.4922,city:"Rome",country:"Italy"},
"sagrada familia":{lat:41.4036,lng:2.1744,city:"Barcelona",country:"Spain"}

};

const flagMap={
"🇹🇷":"turkey",
"🇯🇵":"japan",
"🇫🇷":"france",
"🇮🇹":"italy",
"🇪🇸":"spain",
"🇸🇦":"saudi arabia",
"🇺🇸":"united states"
};

function detectLandmark(text){

text=text.toLowerCase();

for(const name in landmarks){

if(text.includes(name)){
return landmarks[name];
}

}

return null;

}

function detectFlag(text){

for(const f in flagMap){

if(text.includes(f)){
return flagMap[f];
}

}

return null;

}

function resolveLocation(video){

let text=
(video.title||"")+
" "+
(video.description||"");

text=normalizeTurkish(text);


// 1 landmark

const landmark=detectLandmark(text);

if(landmark){

return{
location:landmark.city,
country:landmark.country,
lat:landmark.lat,
lng:landmark.lng,
type:"landmark"
};

}


// 2 city

const city=detectCity(text);

if(city){

return{
location:city.city,
country:city.country,
lat:city.lat,
lng:city.lng,
type:"city"
};

}


// 3 emoji

const flag=detectFlag(text);

if(flag){

const country=detectCountry(flag);

if(country){

return{
location:country.name,
country:country.name,
lat:country.lat,
lng:country.lng,
type:"country"
};

}

}


// 4 country

const country=detectCountry(text);

if(country){

return{
location:country.name,
country:country.name,
lat:country.lat,
lng:country.lng,
type:"country"
};

}


return null;

}

module.exports={resolveLocation};
