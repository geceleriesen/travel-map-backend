const fs = require("fs");
const csv = require("csv-parser");

let cityIndex = {};

/* words that should never be cities */

const stopWords = new Set([
"the","and","to","for","with","from","this","that",
"travel","vlog","trip","tour","video","day","my",
"your","our","their","holiday","of","in","on","at",
"march","best","new","first"
]);

function loadCities(){

return new Promise((resolve)=>{

fs.createReadStream("./worldcities.csv")
.pipe(csv())
.on("data",(row)=>{

const name = row.city.toLowerCase();

const cityData = {
city:row.city,
country:row.country,
lat:parseFloat(row.lat),
lng:parseFloat(row.lng),
population:parseInt(row.population)||0
};

if(!cityIndex[name]){

cityIndex[name] = cityData;

}else{

if(cityData.population > cityIndex[name].population){
cityIndex[name] = cityData;
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

text = text.toLowerCase();

const words = text.split(/\s+/);

for(let w of words){

/* clean word */

w = w.replace(/[^a-z]/g,"");

/* skip short words */

if(w.length < 3) continue;

/* skip stop words */

if(stopWords.has(w)) continue;

/* check city */

if(cityIndex[w]){

return cityIndex[w];

}

}

return null;

}

module.exports = { loadCities, detectCity };
