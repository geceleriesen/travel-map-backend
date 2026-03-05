import cities from "./cities.json" assert {type:"json"}

export default function detectCity(title){

title=title.toLowerCase()

for(const city of cities){

if(title.includes(city.name.toLowerCase())){

return city

}

}

return {

lat:0,
lng:0

}

}
