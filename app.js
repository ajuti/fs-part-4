const config = require("./utils/config")
const log = require("./utils/logger")
const express = require("express")
require("express-async-errors")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
const blogRouter = require("./controllers/blogController")
const errorMiddleware = require("./utils/middlewares/errorMiddleware")
const userRouter = require("./controllers/userController")
const loginRouter = require("./controllers/loginController")
const tokenExtractor = require("./utils/middlewares/tokenExtractor")
const userExtractor = require("./utils/middlewares/userExtractor")

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
app.use(tokenExtractor)
app.use(userExtractor)

/* Routers */
app.use("/api/blogs", blogRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)

if (process.env.NODE_ENV === "test") {
  const testRouter = require("./controllers/testController")
  app.use("/api/testing", testRouter)
}

app.use(errorMiddleware)

module.exports = app
