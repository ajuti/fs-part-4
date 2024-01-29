const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")
const log = require("../utils/logger")
const helper = require("./test_helper")

beforeEach(async() => {
  await Blog.deleteMany({})
  const initBlogs = helper.initBlogs

  await Blog.insertMany(initBlogs)
})

const api = supertest(app)

test("correct amount of blogs are returned as json" , async() => {
  const res = await api.get("/api/blogs")
  expect(res.status).toBe(200)
  expect(res.type).toMatch(/application\/json/)
  expect(res.body).toHaveLength(3)
})

test("blogs can be added, with a valid token", async() => {
  const token = (await api.post("/api/login").send({ username: "ajuti", password: "sekret" })).body.token

  const res = await api
    .post("/api/blogs")
    .set("authorization", `Bearer ${token}`)
    .send(
      {
        title: "fourth blog",
        author: "ajuti",
        url: "hei.net",
        likes: 8,
        user: "65b2bde9944514049ef47aab",
      }
    )
  expect(res.status).toBe(201)
  expect(res.body).toMatchObject(
    {
      title: "fourth blog",
      author: "ajuti",
      url: "hei.net",
      likes: 8,
      user: "65b2bde9944514049ef47aab"
    }
  )
  const allBlogs = await api.get("/api/blogs")
  expect(allBlogs.body).toHaveLength(helper.initBlogs.length + 1)
})

test("blogs cannot be added without proper token", async() => {
  const res = await api
    .post("/api/blogs")
    .send(
      {
        title: "fourth blog",
        author: "ajuti",
        url: "hei.net",
        likes: 8,
        user: "65b2bde9944514049ef47aab",
      }
    )
  expect(res.status).toBe(401)
})

test("blogs have a field called id", async() => {
  const res = await api.get("/api/blogs")
  for (let blog of res.body) {
    expect(blog.id).toBeDefined()
    expect(blog.__v).not.toBeDefined()
  }
})

test("blogs are initialized with 0 likes, if no likes attribute is given", async() => {
  const token = (await api.post("/api/login").send({ username: "ajuti", password: "sekret" })).body.token

  const res = await api
    .post("/api/blogs")
    .set("authorization", `Bearer ${token}`)
    .send(
      {
        title: "fourth blog",
        author: "ajuti",
        url: "hei.net",
        user: "65b2bde9944514049ef47aab",
      }
    )
  expect(res.body.likes).toBeDefined()
  expect(res.body.likes).toBe(0)
})

test("if post request doesnt contain both title and url fields, respond with 400", async() => {
  const token = (await api.post("/api/login").send({ username: "ajuti", password: "sekret" })).body.token

  const invalidBlogs = [{ title: "only title given", author: "mz", likes: 4 }, { author: "mz", url: "only url given", likes: 4 }, { author: "neither is given", likes: 4 }]
  const promiseArray = invalidBlogs.map(async(blog) => {
    return await api.post("/api/blogs").set("authorization", `Bearer ${token}`).send(blog)
  })
  const fulfilled = await Promise.all(promiseArray)

  for (let res of fulfilled) {
    expect(res.status).toBe(401)
  }
})

test("deleting a post with given id works", async() => {
  const token = (await api.post("/api/login").send({ username: "ajuti", password: "sekret" })).body.token

  const initialBlogs = await api.get("/api/blogs")
  const idToBeDeleted = initialBlogs.body[0].id
  log.info(idToBeDeleted)

  await api
    .delete(`/api/blogs/${idToBeDeleted}`)
    .set("authorization", `Bearer ${token}`)
    .expect(204)

  const resultingBlogs = await api.get("/api/blogs")

  const ids = resultingBlogs.body.map(blog => blog.id)

  expect(ids).not.toContain(idToBeDeleted)
})

describe("updating", () => {
  test("the amount of likes works, with correct id and new likeamount", async() => {
    const id = (await api.get("/api/blogs")).body[0].id
    log.info(id)

    const updatedLikes = 55

    const update = await api
      .patch(`/api/blogs/${id}`)
      .send({ updatedLikes })

    expect(update.status).toBe(200)

    const updatedDoc = (await api.get("/api/blogs")).body.find(doc => doc.id === id)

    expect(updatedDoc.likes).toBe(55)
  })

  test("doesnt work if called with invalid id", async() => {
    const update = await api
      .patch("/api/blogs/55b2b2a0f8625590e0934a55")
      .send({ updatedLikes: 88 })

    expect(update.status).toBe(400)
  })

  test("doesnt work if no updatedLikes field", async() => {
    const update = await api
      .patch("/api/blogs/65b2b570c627ac18cddb27cd")
      .send({ newLikes: 5 })

    expect(update.status).toBe(400)
    expect(update.body.error).toBeDefined()
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})