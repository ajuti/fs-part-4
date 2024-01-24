const config = require("./utils/config")
const log = require("./utils/logger")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
const blogRouter = require("./controllers/blogController")

mongoose.set("strictQuery", false)

log.info("Connecting to: ", config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    log.info("Connected to MongoDB")
  })
  .catch((error) => {
    log.info("Connection to MongoDB failed: ", error.message)
  })

app.use(cors())
app.use(express.static("build"))
app.use(express.json())

/* Routers */
app.use("/api/blogs", blogRouter)

module.exports = app
