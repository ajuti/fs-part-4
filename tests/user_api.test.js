const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const User = require("../models/user")
const log = require("../utils/logger")
const bcrypt = require("bcrypt")
const helper = require("./test_helper")
const Blog = require("../models/blog")

const api = supertest(app)

beforeEach(async() => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash("sekret", 10)
  const user = new User({
    username: "ajuti",
    name: "Aapo Jutila",
    passwordHash: passwordHash,
    _id: new mongoose.Types.ObjectId("65b2bde9944514049ef47aab"),
  })
  const blogs = (await Blog.find({ author: "ajuti" })).map(blog => blog._id)
  log.info(blogs)
  user.blogs = blogs
  await user.save()
})

test("initial user is found", async() => {
  const users = await api.get("/api/users") 

  log.info(users.body)

  expect(users.body[0].username).toBe("ajuti")
})