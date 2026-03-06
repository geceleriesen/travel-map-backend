const express=require("express");
const {loadCities}=require("./cityDetector");
const {processVideos}=require("./youtube");

const app=express();

app.use(express.static("public"));

const PORT=3000;

let videos=[

{
id:"tokyo",
title:"TOKYO STREET FOOD",
description:"japonya tokyo sokak yemekleri gezisi",
thumbnail:""
},

{
id:"paris",
title:"PARİS GEZİSİ",
description:"fransa paris travel vlog",
thumbnail:""
},

{
id:"desert",
title:"ÇÖL GEZİSİ",
description:"suudi arabistan riyadh desert",
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
console.log("Server running:",PORT);
});

}

start();
