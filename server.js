import express from "express"
import cors from "cors"
import { updateCache, getCache } from "./cache.js"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 10000

updateCache()

setInterval(updateCache, 1000 * 60 * 30)

app.get("/api/videos", async (req, res) => {
  res.json(getCache())
})

app.listen(PORT, () => {
  console.log("Travel Map Engine running on", PORT)
})
