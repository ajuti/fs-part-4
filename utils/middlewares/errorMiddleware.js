const log = require("../../utils/logger")

const errorMiddleware = (error, req, res, next) => {
  log.error("ErrorMiddleware: ", error.name, error.message)

  if (error.name === "ValidationError") {
    return res.status(401).json({ error: error.message })
  } else if (error.name === "JsonWebTokenError") {
    return res.status(400).json({ error: error.message })
  }

  res.status(400).json({ error: error.message })

  next(error) // unknown endpoint
}

module.exports = errorMiddleware