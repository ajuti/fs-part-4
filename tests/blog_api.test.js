const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")
const log = require("../utils/logger")

const initBlogs = [
  {
    title: "first blog",
    author: "ajuti",
    url: "moi.fi",
    likes: 12
  },
  {
    title: "second blog",
    author: "cankkuboy",
    url: "yo.com",
    likes: 29
  },
  {
    title: "third blog",
    author: "jesshei",
    url: "sup.org",
    likes: 14
  }
]

beforeEach(async() => {
  await Blog.deleteMany({})
  await Blog.insertMany(initBlogs)
})

const api = supertest(app)

test("correct amount of blogs are returned as json" , async() => {
  const res = await api.get("/api/blogs")
  expect(res.status).toBe(200)
  expect(res.type).toMatch(/application\/json/)
  expect(res.body).toHaveLength(3)
})

test("blogs can be added", async() => {
  const res = await api
    .post("/api/blogs")
    .send(
      {
        title: "fourth blog",
        author: "laemoi",
        url: "hei.net",
        likes: 8
      }
    )
  expect(res.status).toBe(201)
  expect(res.body).toMatchObject(
    {
      title: "fourth blog",
      author: "laemoi",
      url: "hei.net",
      likes: 8
    }
  )
  const allBlogs = await api.get("/api/blogs")
  expect(allBlogs.body).toHaveLength(initBlogs.length + 1)
})

test("blogs have a field called id", async() => {
  const res = await api.get("/api/blogs")
  for (let blog of res.body) {
    expect(blog.id).toBeDefined()
    expect(blog.__v).not.toBeDefined()
  }
})

test("blogs are initialized with 0 likes, if no likes attribute is given", async() => {
  const res = await api
    .post("/api/blogs")
    .send(
      {
        title: "fourth blog",
        author: "laemoi",
        url: "hei.net",
      }
    )
  expect(res.body.likes).toBeDefined()
  expect(res.body.likes).toBe(0)
})

test("if post request doesnt contain both title and url fields, respond with 400", async() => {
  const invalidBlogs = [{ title: "only title given", author: "mz", likes: 4 }, { author: "mz", url: "only url given", likes: 4}, { author: "neither is given", likes: 4 }]
  const promiseArray = invalidBlogs.map(async(blog) => {
    return await api.post("/api/blogs").send(blog)
  })
  const fulfilled = await Promise.all(promiseArray)

  for (let res of fulfilled) {
    expect(res.status).toBe(400)
  }
})

afterAll(async () => {
  await mongoose.connection.close()
})