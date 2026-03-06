const { detectCity } = require("./cityDetector");
const { detectCountry } = require("./countries");
const { normalizeTurkish } = require("./turkishNormalizer");
const { getLearnedLocation, learnLocation } = require("./geoLearner");


function resolveLocation(video){

const learned = getLearnedLocation(video);

if(learned) return learned;


/* combine text */

let text =
(video.title || "") +
" " +
(video.description || "");

text = normalizeTurkish(text);


/* detect country */

const country = detectCountry(text);


/* detect city */

const city = detectCity(
text,
country ? country.name : null
);


/* city priority */

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


/* fallback country */

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


/* nothing */

return null;

}

module.exports={resolveLocation};
