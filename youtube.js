import fetch from "node-fetch"

export async function getChannelVideos(channel){

const url = `https://www.youtube.com/${channel}/videos`

const html = await fetch(url).then(r=>r.text())

const json = html.split("var ytInitialData =")[1].split(";</script>")[0]

const data = JSON.parse(json)

const tabs =
data.contents.twoColumnBrowseResultsRenderer.tabs

let videos=[]

for(const tab of tabs){

const content =
tab.tabRenderer?.content?.richGridRenderer?.contents

if(!content) continue

for(const item of content){

const video =
item.richItemRenderer?.content?.videoRenderer

if(!video) continue

videos.push({

id:video.videoId,
title:video.title.runs[0].text,
thumbnail:video.thumbnail.thumbnails.pop().url

})

}

}

return videos

}
