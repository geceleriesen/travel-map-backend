const countries = {

  "turkey": { name: "Turkey", lat: 38.9637, lng: 35.2433 },
  "türkiye": { name: "Turkey", lat: 38.9637, lng: 35.2433 },

  "japan": { name: "Japan", lat: 36.2048, lng: 138.2529 },
  "japonya": { name: "Japan", lat: 36.2048, lng: 138.2529 },

  "france": { name: "France", lat: 46.2276, lng: 2.2137 },
  "fransa": { name: "France", lat: 46.2276, lng: 2.2137 },

  "italy": { name: "Italy", lat: 41.8719, lng: 12.5674 },
  "italya": { name: "Italy", lat: 41.8719, lng: 12.5674 },

  "spain": { name: "Spain", lat: 40.4637, lng: -3.7492 },
  "ispanya": { name: "Spain", lat: 40.4637, lng: -3.7492 },

  "saudi arabia": { name: "Saudi Arabia", lat: 23.8859, lng: 45.0792 },
  "suudi arabistan": { name: "Saudi Arabia", lat: 23.8859, lng: 45.0792 },

  "united states": { name: "United States", lat: 37.0902, lng: -95.7129 },
  "amerika": { name: "United States", lat: 37.0902, lng: -95.7129 },
  "abd": { name: "United States", lat: 37.0902, lng: -95.7129 },

  "united kingdom": { name: "United Kingdom", lat: 55.3781, lng: -3.4360 },
  "ingiltere": { name: "United Kingdom", lat: 55.3781, lng: -3.4360 },

  "germany": { name: "Germany", lat: 51.1657, lng: 10.4515 },
  "almanya": { name: "Germany", lat: 51.1657, lng: 10.4515 }

};

function detectCountry(text) {

  const t = text.toLowerCase();

  for (const key in countries) {

    if (t.includes(key)) {
      return countries[key];
    }

  }

  return null;

}

module.exports = {
  detectCountry
};
