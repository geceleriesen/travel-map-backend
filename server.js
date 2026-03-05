import express from "express"
import cors from "cors"
import fetch from "node-fetch"
import fs from "fs"
import {parseStringPromise} from "xml2js"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

const CACHE_FILE = "cache.json"



const CITY_DB = {
"porto riko":[18.2208,-66.5901],
"puerto rico":[18.2208,-66.5901],
"meksika":[23.6345,-102.5528],
"mexico":[23.6345,-102.5528],
"kahire":[30.0444,31.2357],
"cairo":[30.0444,31.2357],
"mısır":[26.8206,30.8025],
"egypt":[26.8206,30.8025],
"malezya":[4.2105,101.9758],
"malaysia":[4.2105,101.9758],
"istanbul":[41.0082,28.9784]
}



function detectLocation(text){

text = text.toLowerCase()

for(const city in CITY_DB){

if(text.includes(city)){

return {
lat:CITY_DB[city][0],
lng:CITY_DB[city][1]
}

}

}

return null

}



async function getVideosFromRSS(){

const url =
`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

const xml = await fetch(url).then(r=>r.text())

const data = await parseStringPromise(xml)

const entries = data.feed.entry || []

const videos=[]

for(const e of entries){

const id = e["yt:videoId"][0]

const title = e.title[0]

const thumb =
`https://img.youtube.com/vi/${id}/hqdefault.jpg`

const loc = detectLocation(title)

if(!loc) continue

videos.push({

id,
title,
thumbnail:thumb,
lat:loc.lat,
lng:loc.lng

})

}

return videos

}



async function buildCache(){

const videos = await getVideosFromRSS()

fs.writeFileSync(
CACHE_FILE,
JSON.stringify(videos,null,2)
)

return videos

}



app.get("/api/videos", async(req,res)=>{

try{

if(fs.existsSync(CACHE_FILE)){

const cache =
JSON.parse(fs.readFileSync(CACHE_FILE))

return res.json(cache)

}

const videos = await buildCache()

res.json(videos)

}catch(e){

console.log(e)

res.json([])

}

})



app.get("/refresh", async(req,res)=>{

const videos = await buildCache()

res.json({
status:"cache updated",
videos:videos.length
})

})



setInterval(async()=>{

await buildCache()

console.log("cache refreshed")

},6*60*60*1000)



app.listen(PORT,()=>{

console.log("Travel Map Backend Running")

})
