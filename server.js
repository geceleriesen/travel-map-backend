const express=require("express");
const {loadCities}=require("./cityDetector");
const {processVideos}=require("./youtube");

const app=express();

app.use(express.static("public"));

const PORT=3000;

let videos=[

{
id:"1",
title:"ROMA GEZİSİ",
description:"italya roma travel vlog",
thumbnail:""
},

{
id:"2",
title:"TOKYO STREET FOOD",
description:"japonya tokyo sokak yemekleri",
thumbnail:""
},

{
id:"3",
title:"PARİS GEZİ VLOG",
description:"fransa paris gezi",
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
