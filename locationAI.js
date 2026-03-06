// locationAI.js

const {detectCity}=require("./cityDetector");
const {detectCountry}=require("./countries");
const {normalizeTurkish}=require("./turkishNormalizer");
const {getLearnedLocation,learnLocation}=require("./geoLearner");

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

function resolveLocation(video){

// 0 learned location

const learned=getLearnedLocation(video);

if(learned){
return learned;
}


let text=
(video.title||"")+
" "+
(video.description||"");

text=normalizeTurkish(text);


// 1 city

const city=detectCity(text);

if(city){

const result={
location:city.city,
country:city.country,
lat:city.lat,
lng:city.lng,
type:"city"
};

learnLocation(video,result);

return result;

}


// 2 emoji

const flag=detectFlag(text);

if(flag){

const country=detectCountry(flag);

if(country){

const result={
location:country.name,
country:country.name,
lat:country.lat,
lng:country.lng,
type:"country"
};

learnLocation(video,result);

return result;

}

}


// 3 country

const country=detectCountry(text);

if(country){

const result={
location:country.name,
country:country.name,
lat:country.lat,
lng:country.lng,
type:"country"
};

learnLocation(video,result);

return result;

}


return null;

}

module.exports={resolveLocation};
