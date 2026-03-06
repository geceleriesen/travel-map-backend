const express = require("express");
const cors = require("cors");

const { loadCities } = require("./cityDetector");
const { processVideos } = require("./youtube");
const { loadCache } = require("./geoLearner");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;


/*
TEST VIDEO DATA
Gerçek projede buraya YouTube API gelecek
*/

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
},

{
id:"unknown1",
title:"ÇOK GÜZEL BİR GEZİ",
description:"harika bir seyahatti",
thumbnail:"https://img.youtube.com/vi/abc126/hqdefault.jpg"
}

];



/*
API ENDPOINT
*/

app.get("/videos", (req,res)=>{

try{

const processed = processVideos(videos);

res.json(processed);

}catch(err){

console.error(err);

res.status(500).json({
error:"video processing failed"
});

}

});



/*
SERVER START
*/

async function start(){

try{

console.log("Loading city database...");

await loadCities();

console.log("Loading geo learning cache...");

loadCache();

app.listen(PORT,()=>{

console.log("Server running on port:",PORT);

});

}catch(err){

console.error("Startup error:",err);

}

}

start();
