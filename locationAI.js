const flagCoords = {

"🇸🇦":{name:"Saudi Arabia",lat:24.7136,lng:46.6753},
"🇺🇸":{name:"USA",lat:39.8283,lng:-98.5795},
"🇹🇼":{name:"Taiwan",lat:25.0330,lng:121.5654},
"🇨🇳":{name:"China",lat:35.8617,lng:104.1954},
"🇲🇽":{name:"Mexico",lat:23.6345,lng:-102.5528},
"🇪🇬":{name:"Egypt",lat:26.8206,lng:30.8025},
"🇲🇾":{name:"Malaysia",lat:4.2105,lng:101.9758},
"🇵🇷":{name:"Puerto Rico",lat:18.2208,lng:-66.5901},
"🇮🇳":{name:"India",lat:20.5937,lng:78.9629}

}

const cityCoords = {

"riyad":{name:"Riyadh",lat:24.7136,lng:46.6753},
"new york":{name:"New York",lat:40.7128,lng:-74.0060},
"dallas":{name:"Dallas",lat:32.7767,lng:-96.7970},
"albuquerque":{name:"Albuquerque",lat:35.0844,lng:-106.6504},
"taipei":{name:"Taipei",lat:25.0330,lng:121.5654},
"şangay":{name:"Shanghai",lat:31.2304,lng:121.4737},
"shanghai":{name:"Shanghai",lat:31.2304,lng:121.4737}

}

export default function locationAI(title){

title = title.toLowerCase()

// FLAG detection

for(const flag in flagCoords){

if(title.includes(flag)){

return flagCoords[flag]

}

}

// CITY detection

for(const city in cityCoords){

if(title.includes(city)){

return cityCoords[city]

}

}

return {
name:null,
lat:null,
lng:null
}

}
