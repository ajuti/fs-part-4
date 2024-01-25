const log = require("../../utils/logger")

const tokenExtractor = (req, res, next) => {
  const auth = req.get("authorization")
  if (auth) {
    req.token = auth
  }

  next()
}

module.exports = tokenExtractor