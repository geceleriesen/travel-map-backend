// server.js

const express = require("express");
const { loadCities } = require("./cityDetector");
const { processVideos } = require("./youtube");

const app = express();

const PORT = 3000;

let videos = [

{
id:"1",
title:"JAPONYA'DA TOKYO SOKAK YEMEKLERİ 🇯🇵",
description:"tokyo street food tour",
thumbnail:""
},

{
id:"2",
title:"SUUDİ ARABİSTAN ÇÖL GEZİSİ",
description:"riyadh desert",
thumbnail:""
}

];

app.get("/videos",(req,res)=>{

  const processed = processVideos(videos);

  res.json(processed);

});

async function start(){

  await loadCities();

  app.listen(PORT,()=>{
    console.log("Server running:",PORT);
  });

}

start();
