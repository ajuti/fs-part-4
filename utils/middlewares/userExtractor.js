const jwt = require("jsonwebtoken")
const log = require("../../utils/logger")

const userExtractor = async(req, res, next) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    req.user = decodedToken.id.toString()
  }

  next()
}

module.exports = userExtractor