const countryPatterns = {

mexico:["meksika","mexico"],
egypt:["mısır","egypt","kahire","cairo"],
india:["hindistan","india"],
malaysia:["malezya","malaysia"],
puertorico:["porto riko","puerto rico"],
japan:["japonya","japan"]

}

const coords = {

mexico:{lat:23.6,lng:-102.5,name:"Mexico"},
egypt:{lat:26.8,lng:30.8,name:"Egypt"},
india:{lat:22.3,lng:78.9,name:"India"},
malaysia:{lat:4.2,lng:102.0,name:"Malaysia"},
puertorico:{lat:18.22,lng:-66.59,name:"Puerto Rico"},
japan:{lat:36.2,lng:138.2,name:"Japan"}

}

export default function locationAI(title){

title=title.toLowerCase()

for(const country in countryPatterns){

for(const word of countryPatterns[country]){

if(title.includes(word)){

return coords[country]

}

}

}

return{

name:null,
lat:null,
lng:null

}

}
