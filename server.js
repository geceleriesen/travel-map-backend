import express from "express"
import cors from "cors"

import {getVideos} from "./youtube.js"

const app = express()

app.use(cors())

const PORT = process.env.PORT || 10000


app.get("/api/videos", async(req,res)=>{

try{

const vids = await getVideos()

res.json(vids)

}catch(e){

console.log(e)

res.json([])

}

})


app.listen(PORT,()=>{

console.log("Travel Map Engine running")

})
