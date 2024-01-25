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

blogRouter.delete("/:id", async(req, res) => {
  const id = req.params.id

  await Blog.findByIdAndDelete(id)
  res.status(204).end()
})

blogRouter.patch("/:id", async(req, res, next) => {
  const id = req.params.id
  const updatedLikes = req.body.updatedLikes ? req.body.updatedLikes : null

  if (!updatedLikes) {
    next({ message: "missing field 'updatedLikes'" })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, { likes: updatedLikes })
  if (updatedBlog) {
    res.status(200).json({ updatedBlog })
  } else {
    next({ message: "malformatted id" })
  }
})

module.exports = blogRouter