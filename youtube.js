const express = require("express");
const { loadCities } = require("./cityDetector");
const { processVideos } = require("./youtube");

const app = express();
const PORT = 3000;

let videos = [];

// example video data
videos = [
  {
    id: "cFMjzdND8-A",
    title: "DÜNYANIN SONU SUUDİ ARABİSTAN 🇸🇦",
    description: "",
    thumbnail: "https://img.youtube.com/vi/cFMjzdND8-A/hqdefault.jpg"
  },
  {
    id: "tokyo123",
    title: "TOKYO STREET FOOD TOUR 🇯🇵",
    description: "",
    thumbnail: ""
  }
];

app.get("/videos", async (req, res) => {

  const processed = await processVideos(videos);

  res.json(processed);

});

async function start() {

  await loadCities();

  app.listen(PORT, () => {
    console.log("Server running on port", PORT);
  });

}

start();
