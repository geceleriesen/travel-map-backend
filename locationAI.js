// locationAI.js

const { detectCity } = require("./cityDetector");
const { detectCountry } = require("./countries");
const { normalizeTurkish } = require("./turkishNormalizer");

const flagMap = {

  "🇹🇷":"turkey",
  "🇯🇵":"japan",
  "🇫🇷":"france",
  "🇮🇹":"italy",
  "🇪🇸":"spain",
  "🇸🇦":"saudi arabia",
  "🇺🇸":"united states"

};

function detectFlag(text){

  for(const flag in flagMap){

    if(text.includes(flag)){
      return flagMap[flag];
    }

  }

  return null;

}

function resolveLocation(video){

  let text =
    (video.title || "") +
    " " +
    (video.description || "");

  text = normalizeTurkish(text);

  // city detection

  const city = detectCity(text);

  if(city){

    return {
      location: city.city,
      country: city.country,
      lat: city.lat,
      lng: city.lng,
      type: "city"
    };

  }

  // emoji

  const flag = detectFlag(text);

  if(flag){

    const country = detectCountry(flag);

    if(country){

      return {
        location: country.name,
        country: country.name,
        lat: country.lat,
        lng: country.lng,
        type:"country"
      };

    }

  }

  // country detection

  const country = detectCountry(text);

  if(country){

    return {
      location: country.name,
      country: country.name,
      lat: country.lat,
      lng: country.lng,
      type:"country"
    };

  }

  return null;

}

module.exports={
  resolveLocation
};
