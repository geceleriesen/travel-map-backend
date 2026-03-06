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

/* 1️⃣ learned cache */

const learned=getLearnedLocation(video);

if(learned) return learned;


/* TEXT */

let text=
(video.title||"")+
" "+
(video.description||"");

text=normalizeTurkish(text);


/* 2️⃣ CITY DETECTION (MOST ACCURATE) */

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


/* 3️⃣ EMOJI */

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


/* 4️⃣ COUNTRY TEXT */

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
