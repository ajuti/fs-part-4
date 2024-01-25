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
  user.blogs = blogs
  await user.save()
})

test("initial user is found", async() => {
  const users = await api.get("/api/users")

  log.info(users.body)

  expect(users.body[0].username).toBe("ajuti")
})

test("logging in as initial user works", async() => {
  const login = await api
    .post("/api/login")
    .send({ username: "ajuti", password: "sekret" })

  expect(login.status).toBe(200)
  expect(login.body.token).toBeDefined()
  expect(login.body).toMatchObject(
    {
      username: "ajuti",
      name: "Aapo Jutila"
    }
  )
})

describe("creating user with", () => {
  test("existing username should return appropriate status code and error message", async() => {
    const create = await api
      .post("/api/users")
      .send({
        username: "ajuti",
        name: "A. Jutila",
        password: "123456"
      })
    
    expect(create.status).toBe(401)
  })

  test("too short password should return appropriate status code and error message", async() => {
    const create = await api
      .post("/api/users")
      .send({
        username: "laemoi",
        name: "L. Oinas",
        password: "12"
      })

    expect(create.status).toBe(401)
  })
})