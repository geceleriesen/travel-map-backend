import express from "express"
import cors from "cors"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const CHANNEL =
"https://www.youtube.com/@YOUR_CHANNEL/videos"



const locations = {

"mexico":[23.63,-102.55],
"meksika":[23.63,-102.55],

"cairo":[30.04,31.23],
"kahire":[30.04,31.23],

"medina":[24.52,39.56],
"medine":[24.52,39.56],

"mecca":[21.38,39.85],
"mekke":[21.38,39.85],

"riyadh":[24.71,46.67],
"riyad":[24.71,46.67],

"puerto rico":[18.22,-66.59],
"porto riko":[18.22,-66.59]

}



function detectLocation(text){

text = text.toLowerCase()

for(const key in locations){

if(text.includes(key)){

return {
lat:locations[key][0],
lng:locations[key][1]
}

}

}

return null

}



function randomLocation(){

return {

lat:20 + (Math.random()*60 - 30),

lng:(Math.random()*120 - 60)

}

}



async function getVideos(){

const res = await fetch(CHANNEL)

const html = await res.text()



const idMatches =
[...html.matchAll(/"videoId":"(.*?)"/g)]

const titleMatches =
[...html.matchAll(/"title":{"runs":\[\{"text":"(.*?)"/g)]



const ids =
[...new Set(idMatches.map(v=>v[1]))]



const videos = ids.map((id,i)=>{

const title =
titleMatches[i]?.[1] || "YouTube Video"



let loc = detectLocation(title)

if(!loc){

loc = randomLocation()

}



return {

id,
title,

thumbnail:
`https://img.youtube.com/vi/${id}/hqdefault.jpg`,

lat:loc.lat,
lng:loc.lng

}

})



return videos

}



app.get("/api/videos", async (req,res)=>{

try{

const videos = await getVideos()

res.json(videos)

}catch(e){

console.log(e)

res.json([])

}

})



app.listen(PORT,()=>{

console.log("Travel backend running")

})
