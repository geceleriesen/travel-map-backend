import cities from "./cities.js"

export function matchCity(names){

for(const name of names){

const city = cities.find(c => name.includes(c.name))

if(city){

return {

lat: city.lat,
lng: city.lng,
name: city.name

}

}

}

return null

}
