const User = require("../models/user")

const usersInDb = async() => {
  const users = User.find({})
  return users.map(u => u.toJSON())
}

const initBlogs = [
  {
    title: "first blog",
    author: "ajuti",
    url: "moi.fi",
    likes: 12,
    user: "65b2bde9944514049ef47aab"
  },
  {
    title: "second blog",
    author: "ajuti",
    url: "yo.com",
    likes: 29,
    user: "65b2bde9944514049ef47aab"
  },
  {
    title: "third blog",
    author: "ajuti",
    url: "sup.org",
    likes: 14,
    user: "65b2bde9944514049ef47aab"
  }
]

module.exports = {
  usersInDb,
  initBlogs
}