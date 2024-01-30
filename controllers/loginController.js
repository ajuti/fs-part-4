const jwt = require("jsonwebtoken")
const loginRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const log = require("../utils/logger")

loginRouter.post("/", async(req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const correctPassword = user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && correctPassword)) {
    return res.status(401).json({
      error: "invalid username or password"
    })
  }

  const tokenUser = {
    username: username,
    id: user._id,
  }

  const token = jwt.sign(tokenUser, process.env.SECRET)

  log.info("Logged in as: ", username, "with token: ", token)
  res.status(200).send({ token, username, name: user.name })
})

module.exports = loginRouter