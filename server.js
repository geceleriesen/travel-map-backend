const express=require("express");
const {loadCities}=require("./cityDetector");
const {processVideos}=require("./youtube");

const app=express();

const PORT=3000;

let videos=[

{
id:"tokyo1",
title:"TOKYO STREET FOOD 🇯🇵",
description:"japonya tokyo street food",
thumbnail:"https://img.youtube.com/vi/tokyo1/hqdefault.jpg"
},

{
id:"paris1",
title:"PARIS EIFFEL TOWER TRAVEL",
description:"",
thumbnail:""
},

{
id:"saudi1",
title:"SUUDİ ARABİSTAN ÇÖL GEZİSİ",
description:"",
thumbnail:""
}

];

app.get("/videos",(req,res)=>{

const processed=processVideos(videos);

res.json(processed);

});

async function start(){

await loadCities();

app.listen(PORT,()=>{
console.log("Server running",PORT);
});

}

start();
