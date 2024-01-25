const jwt = require("jsonwebtoken")
const loginRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

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

  res.status(200).send({ token, username, name: user.name })
})

module.exports = loginRouter