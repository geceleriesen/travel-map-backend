// locationAI.js

const {detectCity}=require("./cityDetector");
const {detectCountry}=require("./countries");
const {normalizeTurkish}=require("./turkishNormalizer");

const flagMap={
"🇹🇷":"türkiye",
"🇯🇵":"japonya",
"🇫🇷":"fransa",
"🇮🇹":"italya",
"🇪🇸":"ispanya",
"🇸🇦":"suudi arabistan",
"🇺🇸":"amerika"
};

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


// CITY

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


// EMOJI

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


// COUNTRY

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
