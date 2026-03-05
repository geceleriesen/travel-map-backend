import * as cheerio from "cheerio"
import detectCity from "./cityDetector.js"

const CHANNEL_URL="https://www.youtube.com/@ifkoparan/videos"

export default async function getVideos(){

const html = await fetch(CHANNEL_URL).then(r=>r.text())

const $ = cheerio.load(html)

const videos=[]

$("a#video-title-link").each((i,el)=>{

const title=$(el).text().trim()

const url=$(el).attr("href")

if(!url) return

const id=url.split("v=")[1]

const city=detectCity(title)

videos.push({

id:id,
title:title,
thumbnail:`https://img.youtube.com/vi/${id}/hqdefault.jpg`,
lat:city.lat,
lng:city.lng

})

})

return videos

}
