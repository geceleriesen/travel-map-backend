const fs=require("fs");
const csv=require("csv-parser");

let cityIndex={};

const stopWords=new Set([
"travel","vlog","trip","tour","video",
"holiday","best","new","my","your",
"and","the","of","in","on","at","march",
"today","explore","street","food"
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

cityIndex[name]=[];

}

cityIndex[name].push(data);

})
.on("end",()=>{

console.log("Cities indexed:",Object.keys(cityIndex).length);

resolve();

});

});

}


function detectCity(text,countryHint){

text=text.toLowerCase();

const words=text.split(/\s+/);

for(let w of words){

w=w.replace(/[^a-z]/g,"");

if(w.length<3) continue;

if(stopWords.has(w)) continue;

if(!cityIndex[w]) continue;


/* country hint */

if(countryHint){

const match=cityIndex[w].find(
c=>c.country.toLowerCase()===countryHint.toLowerCase()
);

if(match) return match;

}


/* fallback biggest population */

let best=null;

cityIndex[w].forEach(c=>{

if(!best || c.population>best.population){

best=c;

}

});

return best;

}

return null;

}

module.exports={loadCities,detectCity};
