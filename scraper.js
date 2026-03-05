import fetch from "node-fetch"
import cheerio from "cheerio"

export async function getChannelVideos(channel){

const url=`https://www.youtube.com/${channel}/videos`

const html = await fetch(url).then(r=>r.text())

const $ = cheerio.load(html)

const videos=[]

$("a#video-title").each((i,el)=>{

const link=$(el).attr("href")

if(!link) return

const id=link.split("v=")[1]

const title=$(el).text().trim()

videos.push({

id,
title,
thumbnail:`https://img.youtube.com/vi/${id}/hqdefault.jpg`

})

})

return videos

}
