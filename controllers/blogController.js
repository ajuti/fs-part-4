const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const log = require("../utils/logger")
const jwt = require("jsonwebtoken")

blogRouter.get("/", async(req, res) => {
  const blogs = await Blog
    .find({})
    .populate("user")

  res.json(blogs)
})

blogRouter.post("/", async(req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" })
  }

  const { title, author, url, likes } = req.body
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes ? likes : 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

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