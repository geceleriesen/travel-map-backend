const fs = require("fs");
const csv = require("csv-parser");

let cities = [];

function loadCities() {

  return new Promise((resolve) => {

    fs.createReadStream("worldcities.csv")
      .pipe(csv())
      .on("data", (row) => {

        cities.push({
          city: row.city,
          country: row.country,
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lng)
        });

      })
      .on("end", () => {
        console.log("Cities loaded:", cities.length);
        resolve();
      });

  });

}

function detectCity(text) {

  const t = text.toLowerCase();

  for (const c of cities) {

    if (t.includes(c.city.toLowerCase())) {
      return c;
    }

  }

  return null;

}

module.exports = {
  loadCities,
  detectCity
};
