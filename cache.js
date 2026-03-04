import { getAllVideos } from "./youtube.js"
import { detectLocation } from "./locationAI.js"
import { geocode } from "./geocode.js"

let cache = []

export function getCache(){
return cache
}

export async function updateCache(){

console.log("Scanning channel...")

const videos = await getAllVideos()

const results = []

for(const video of videos){

const text = video.title + " " + video.description

const place = detectLocation(text)

if(!place) continue

const geo = await geocode(place)

if(!geo) continue

results.push({
id:video.id,
lat:geo.lat,
lng:geo.lng,
location:geo.name,
title:video.title,
shortDescription:video.description.slice(0,120),
thumbnail:video.thumbnail
})
}

cache = results

console.log("Videos mapped:",results.length)
}
