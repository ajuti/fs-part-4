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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlogs
}