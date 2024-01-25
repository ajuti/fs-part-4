const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const log = require("../utils/logger")

blogRouter.get("/", (req, res) => {
  Blog
    .find({})
    .then(blogs => {
      res.json(blogs)
    })
})

blogRouter.post("/", async(req, res) => {
  const { title, author, url, likes, user } = await req.body

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes ? likes : 0,
    user: user
  })

  const savedBlog = await blog.save()
  const userById = await User.findById({ _id: user })

  userById.blogs = userById.blogs.concat(savedBlog.id)
  await userById.save()

  log.info("successfully updated user")

  res.status(201).json(savedBlog)
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