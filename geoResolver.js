function resolveGeo(video, loc){

/* if no NLP result */

if(!loc){

if(video.geotag){

return {

location:"Geotag",
country:"Unknown",
lat:video.geotag.lat,
lng:video.geotag.lng,
type:"geotag"

};

}

return null;

}


/* if geotag exists check conflict */

if(video.geotag){

const latDiff = Math.abs(loc.lat - video.geotag.lat);
const lngDiff = Math.abs(loc.lng - video.geotag.lng);


/* if difference too large use geotag */

if(latDiff > 5 || lngDiff > 5){

return {

location:"Geotag",
country:"Unknown",
lat:video.geotag.lat,
lng:video.geotag.lng,
type:"geotag"

};

}

}


/* city result ok */

return loc;

}

module.exports={resolveGeo};
