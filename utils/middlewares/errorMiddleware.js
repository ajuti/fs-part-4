const log = require("../../utils/logger")

const errorMiddleware = (error, req, res, next) => {
  log.error(error.message)

  res.status(400).json({ error: error.message })

  next(error) // unknown endpoint
}

module.exports = errorMiddleware