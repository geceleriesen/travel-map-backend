const { findNearestCity } = require("./cityDetector");

function resolveGeo(video, loc){

/* no NLP result */

if(!loc){

if(video.geotag){

const nearest = findNearestCity(
video.geotag.lat,
video.geotag.lng
);

if(nearest){

return {
location:nearest.city,
country:nearest.country,
lat:video.geotag.lat,
lng:video.geotag.lng,
type:"geotag"
};

}

return {
location:"Unknown",
country:"Unknown",
lat:video.geotag.lat,
lng:video.geotag.lng,
type:"geotag"
};

}

return null;

}


/* conflict check */

if(video.geotag){

const latDiff = Math.abs(loc.lat - video.geotag.lat);
const lngDiff = Math.abs(loc.lng - video.geotag.lng);

if(latDiff > 10 || lngDiff > 10){

const nearest = findNearestCity(
video.geotag.lat,
video.geotag.lng
);

if(nearest){

return {
location:nearest.city,
country:nearest.country,
lat:video.geotag.lat,
lng:video.geotag.lng,
type:"geotag"
};

}

}

}

return loc;

}

module.exports = { resolveGeo };
