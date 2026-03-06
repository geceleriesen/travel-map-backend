const fs=require("fs");
const csv=require("csv-parser");

let cityIndex={};

const stopWords=new Set([
"travel","vlog","trip","tour","video",
"holiday","best","new","my","your",
"and","the","of","in","on","at","march"
]);

function loadCities(){

return new Promise(resolve=>{

fs.createReadStream("./worldcities.csv")
.pipe(csv())
.on("data",(row)=>{

const name=row.city.toLowerCase();

const data={
city:row.city,
country:row.country,
lat:parseFloat(row.lat),
lng:parseFloat(row.lng),
population:parseInt(row.population)||0
};

if(!cityIndex[name]){

cityIndex[name]=data;

}else{

if(data.population > cityIndex[name].population){

cityIndex[name]=data;

}

}

})
.on("end",()=>{

console.log("Cities indexed:",Object.keys(cityIndex).length);

resolve();

});

});

}


function detectCity(text){

text=text.toLowerCase();

const words=text.split(/\s+/);

for(let w of words){

w=w.replace(/[^a-z]/g,"");

if(w.length<3) continue;

if(stopWords.has(w)) continue;

if(cityIndex[w]) return cityIndex[w];

}

return null;

}

module.exports={loadCities,detectCity};
