const express = require("express");
const cors = require("cors");

const { loadCities } = require("./cityDetector");
const { loadCache } = require("./geoLearner");
const { getVideos } = require("./youtube");

const app = express();

app.use(cors({ origin:"*" }));

const PORT = process.env.PORT || 3000;


/* health */

app.get("/",(req,res)=>{
res.json({status:"ok"});
});


/* videos */

app.get("/videos", async (req,res)=>{

try{

const videos = await getVideos();

res.json(videos);

}catch(err){

console.error(err);

res.status(500).json({error:"video fetch failed"});

}

});


async function start(){

console.log("Loading cities...");

await loadCities();

loadCache();

app.listen(PORT,()=>{
console.log("Server running:",PORT);
});

}

start();
