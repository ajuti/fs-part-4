const lodash = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map(blog => blog.likes).reduce((acc, likes) => acc + likes, 0)
}

const favoriteBlogs = (blogs) => {
  const blogList = blogs.sort(function (a, b) {
    if (a.likes < b.likes) {
      return 1
    } else {
      return -1
    }
  })
  return blogList[0]
}

const mostBlogs = (blogs) => {
  const authors = lodash.maxBy(blogs, "author")
  const blogCount = lodash.max(Object.values(lodash.countBy(blogs, "author")))
  return {
    author: authors.author,
    blogs: blogCount
  }
}

const mostLikes = (blogs) => {
  const authors = lodash.groupBy(blogs, "author")
  const summed = lodash.mapValues(authors, function(x) {
    return lodash.sumBy(x, "likes")
  })
  const index = Object.values(summed).indexOf(lodash.max(Object.values(summed)))
  return {
    author: Object.keys(summed)[index],
    likes: Object.values(summed)[index]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlogs,
  mostBlogs,
  mostLikes
}