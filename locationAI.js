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
"🇸🇦":"suudi arabistan"
};

function detectFlag(text){

for(const f in flagMap){

if(text.includes(f)){
return flagMap[f];
}

}

return null;

}

function travelParser(text){

const travelWords=[
"gezisi",
"gezi",
"travel",
"vlog",
"sokak",
"street"
];

for(const w of travelWords){

if(text.includes(w)){

const words=text.split(" ");

return words[0];

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


// city

let city=detectCity(text);

if(city){

return{
location:city.city,
country:city.country,
lat:city.lat,
lng:city.lng,
type:"city"
};

}


// travel parser

const guess=travelParser(text);

if(guess){

city=detectCity(guess);

if(city){

return{
location:city.city,
country:city.country,
lat:city.lat,
lng:city.lng,
type:"city"
};

}

}


// emoji

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


// country

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
