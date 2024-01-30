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
  const user = req.user
  console.log("Posting to root...")

  if (!user) {
    return res.status(401).json({ error: "token invalid" })
  }

  const { title, author, url, likes } = req.body

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes ? likes : 0,
    user: user
  })

  const savedBlog = await blog.save()

  const dbUser = await User.findById(user)
  dbUser.blogs = dbUser.blogs.concat(savedBlog.id)
  await dbUser.save()

  log.info("successfully updated user")

  const populated = await Blog.find({_id: savedBlog._id}).populate("user")

  res.status(201).json(populated[0])
})

blogRouter.delete("/:id", async(req, res) => {
  const id = req.params.id
  const blog = await Blog.findById({ _id: id })

  if (!(req.user && req.user === blog.user.toString())) {
    return res.status(401).json({ error: "token invalid" })
  }

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

blogRouter.put("/:id", async(req, res, next) => {
  const id = req.params.id
  const newBlog = req.body

  if (!newBlog.likes) {
    next({ message: "likes field missing" })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, { new: true }).populate("user")
  if (updatedBlog) {
    res.status(200).json(updatedBlog)
  } else {
    next({ message: "error updating likes" })
  }
})

module.exports = blogRouter