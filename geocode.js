export async function geocode(city){

if(city==="unknown"){

return {
lat:20+(Math.random()*60-30),
lng:(Math.random()*120-60)
}

}

const res = await fetch(

`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`

)

const data = await res.json()

if(!data.length){

return {
lat:20+(Math.random()*60-30),
lng:(Math.random()*120-60)
}

}

return {

lat:parseFloat(data[0].lat),
lng:parseFloat(data[0].lon)

}

}
