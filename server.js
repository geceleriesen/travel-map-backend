const express=require("express");

const {loadCities}=require("./cityDetector");
const {processVideos}=require("./youtube");
const {loadCache}=require("./geoLearner");

const app=express();

app.use(express.static("public"));

const PORT=3000;

let videos=[

{
id:"roma1",
title:"ROMA GEZİSİ",
description:"italya roma travel vlog"
},

{
id:"tokyo1",
title:"TOKYO STREET FOOD",
description:"japonya tokyo sokak yemekleri"
},

{
id:"unknown1",
title:"ÇOK GÜZEL BİR GEZİ",
description:"harika bir seyahatti"
}

];

app.get("/videos",(req,res)=>{

const processed=processVideos(videos);

res.json(processed);

});

async function start(){

await loadCities();
loadCache();

app.listen(PORT,()=>{
console.log("Server running:",PORT);
});

}

start();
