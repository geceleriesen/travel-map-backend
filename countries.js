// countries.js

const countries={

"türkiye":{name:"Turkey",lat:38.9637,lng:35.2433},
"turkey":{name:"Turkey",lat:38.9637,lng:35.2433},

"japonya":{name:"Japan",lat:36.2048,lng:138.2529},
"japan":{name:"Japan",lat:36.2048,lng:138.2529},

"fransa":{name:"France",lat:46.2276,lng:2.2137},
"france":{name:"France",lat:46.2276,lng:2.2137},

"italya":{name:"Italy",lat:41.8719,lng:12.5674},
"italy":{name:"Italy",lat:41.8719,lng:12.5674},

"ispanya":{name:"Spain",lat:40.4637,lng:-3.7492},
"spain":{name:"Spain",lat:40.4637,lng:-3.7492},

"suudi arabistan":{name:"Saudi Arabia",lat:23.8859,lng:45.0792},
"saudi arabia":{name:"Saudi Arabia",lat:23.8859,lng:45.0792}

};

function detectCountry(text){

text=text.toLowerCase();

for(const key in countries){

if(text.includes(key)){
return countries[key];
}

}

return null;

}

module.exports={detectCountry};
