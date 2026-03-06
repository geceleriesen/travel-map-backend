const { detectCity } = require("./cityDetector");
const { detectCountry } = require("./countries");

const flagMap = {
  "🇹🇷": "turkey",
  "🇯🇵": "japan",
  "🇫🇷": "france",
  "🇮🇹": "italy",
  "🇪🇸": "spain",
  "🇸🇦": "saudi arabia",
  "🇺🇸": "united states",
  "🇬🇧": "united kingdom"
};

function detectFlag(text) {

  for (const flag in flagMap) {

    if (text.includes(flag)) {
      return flagMap[flag];
    }

  }

  return null;

}

function resolveLocation(video) {

  const text =
    (video.title || "") +
    " " +
    (video.description || "");

  // city
  const city = detectCity(text);

  if (city) {

    return {
      location: city.city,
      country: city.country,
      lat: city.lat,
      lng: city.lng,
      type: "city"
    };

  }

  // flag
  const flag = detectFlag(text);

  if (flag) {

    const country = detectCountry(flag);

    if (country) {
      return {
        location: country.name,
        country: country.name,
        lat: country.lat,
        lng: country.lng,
        type: "country"
      };
    }

  }

  // country
  const country = detectCountry(text);

  if (country) {

    return {
      location: country.name,
      country: country.name,
      lat: country.lat,
      lng: country.lng,
      type: "country"
    };

  }

  return null;

}

module.exports = {
  resolveLocation
};
