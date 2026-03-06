const cities = require("./cityDetector");

function resolveGeo(video, loc){

/* if no NLP result */

if(!loc){

if(video.geotag){

const nearest = cities.findNearestCity(
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


/* conflict */

if(latDiff > 10 || lngDiff > 10){

const nearest = cities.findNearestCity(
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


/* city ok */

return loc;

}

module.exports={resolveGeo};
