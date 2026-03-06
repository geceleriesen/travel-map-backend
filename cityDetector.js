const fs = require("fs");
const csv = require("csv-parser");

let cityIndex = {};

function loadCities(){

return new Promise((resolve)=>{

fs.createReadStream("./worldcities.csv")
.pipe(csv())
.on("data",(row)=>{

const name=row.city.toLowerCase();

const cityData={
city:row.city,
country:row.country,
lat:parseFloat(row.lat),
lng:parseFloat(row.lng),
population:parseInt(row.population)||0
};

/*
duplicate city varsa
en büyük population olanı seç
*/

if(!cityIndex[name]){

cityIndex[name]=cityData;

}else{

if(cityData.population > cityIndex[name].population){

cityIndex[name]=cityData;

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

for(const w of words){

if(cityIndex[w]){

return cityIndex[w];

}

}

return null;

}

module.exports={loadCities,detectCity};
