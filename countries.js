const countries = {

"türkiye":{name:"Turkey",lat:38.9637,lng:35.2433},
"turkiye":{name:"Turkey",lat:38.9637,lng:35.2433},
"turkey":{name:"Turkey",lat:38.9637,lng:35.2433},

"italya":{name:"Italy",lat:41.8719,lng:12.5674},
"italy":{name:"Italy",lat:41.8719,lng:12.5674},

"fransa":{name:"France",lat:46.2276,lng:2.2137},
"france":{name:"France",lat:46.2276,lng:2.2137},

"ispanya":{name:"Spain",lat:40.4637,lng:-3.7492},
"spain":{name:"Spain",lat:40.4637,lng:-3.7492},

"japonya":{name:"Japan",lat:36.2048,lng:138.2529},
"japan":{name:"Japan",lat:36.2048,lng:138.2529},

"almanya":{name:"Germany",lat:51.1657,lng:10.4515},
"germany":{name:"Germany",lat:51.1657,lng:10.4515},

"amerika":{name:"United States",lat:37.0902,lng:-95.7129},
"abd":{name:"United States",lat:37.0902,lng:-95.7129},
"usa":{name:"United States",lat:37.0902,lng:-95.7129},

"tayland":{name:"Thailand",lat:15.87,lng:100.9925},
"thailand":{name:"Thailand",lat:15.87,lng:100.9925}

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
