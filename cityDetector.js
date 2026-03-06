// cityDetector.js

const fs=require("fs");
const csv=require("csv-parser");
const {resolveAlias}=require("./cityAliases");

let cityIndex={};

function loadCities(){

return new Promise(resolve=>{

fs.createReadStream("worldcities.csv")
.pipe(csv())
.on("data",(row)=>{

const name=row.city.toLowerCase();

cityIndex[name]={
city:row.city,
country:row.country,
lat:parseFloat(row.lat),
lng:parseFloat(row.lng)
};

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

for(const w of words){

const city=resolveAlias(w);

if(cityIndex[city]){
return cityIndex[city];
}

}

return null;

}

module.exports={loadCities,detectCity};
