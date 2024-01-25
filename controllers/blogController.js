const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const log = require("../utils/logger")

blogRouter.get("/", (req, res) => {
  Blog
    .find({})
    .then(blogs => {
      res.json(blogs)
    })
})

blogRouter.post("/", async(req, res) => {
  const { title, author, url, likes } = req.body

  const blog = new Blog({
    title: { title, required: true },
    author: author,
    url: { title, required: true },
    likes: likes ? likes : 0
  })

  const result = await blog.save()  
  res.status(201).json(result)
})

module.exports = blogRouter