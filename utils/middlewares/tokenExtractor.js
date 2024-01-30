const log = require("../../utils/logger")

const tokenExtractor = (req, res, next) => {
  const auth = req.get("authorization")
  console.log("Token extractor: ", auth, "req: ", req.body)
  if (auth) {
    req.token = auth.substring(7)
  }

  next()
}

module.exports = tokenExtractor