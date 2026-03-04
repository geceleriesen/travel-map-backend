import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { updateCache, getCache } from "./locationCache.js"

dotenv.config()

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

// update cache every 30 minutes
updateCache()
setInterval(updateCache, 1000 * 60 * 30)

app.get("/api/videos", async (req, res) => {
  res.json(getCache())
})

app.listen(PORT, () => {
  console.log("Travel map engine running on port", PORT)
})
