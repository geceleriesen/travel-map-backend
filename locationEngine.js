import {cities} from "./cities.js"

export function detectLocation(text){

const t=text.toLowerCase()

for(const c of cities){

if(t.includes(c[0])){

return{

name:c[0],
lat:c[1],
lng:c[2]

}

}

}

return null

}
