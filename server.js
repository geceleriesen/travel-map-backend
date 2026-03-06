const express = require("express");
const cors = require("cors");

const { loadCities } = require("./cityDetector");
const { processVideos } = require("./youtube");
const { loadCache } = require("./geoLearner");

const app = express();

/* CORS FIX */

app.use(cors({
origin: "*",
methods: ["GET","POST","OPTIONS"]
}));

app.options("*", cors());

app.use(express.json());

const PORT = process.env.PORT || 3000;


/* TEST DATA */

let videos = [

{
id:"roma1",
title:"ROMA GEZİSİ",
description:"italya roma travel vlog",
thumbnail:"https://img.youtube.com/vi/abc123/hqdefault.jpg"
},

{
id:"tokyo1",
title:"TOKYO STREET FOOD",
description:"japonya tokyo sokak yemekleri",
thumbnail:"https://img.youtube.com/vi/abc124/hqdefault.jpg"
},

{
id:"paris1",
title:"PARİS GEZİ VLOG",
description:"fransa paris gezi",
thumbnail:"https://img.youtube.com/vi/abc125/hqdefault.jpg"
}

];


/* API */

app.get("/videos",(req,res)=>{

try{

const processed = processVideos(videos);

res.setHeader("Access-Control-Allow-Origin","*");

res.json(processed);

}catch(err){

console.error(err);

res.status(500).json({
error:"video processing failed"
});

}

});


/* START */

async function start(){

try{

await loadCities();

loadCache();

app.listen(PORT,()=>{

console.log("Server running on port:",PORT);

});

}catch(err){

console.error("Startup error:",err);

}

}

start();
