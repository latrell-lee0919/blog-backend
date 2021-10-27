const dummy = (blogs) => {
  return blogs.length === 0
    ? 1
    : 2
}

const totalLikes = (blogs) => {
  const likesArray = blogs.map(a => a.likes)

  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.length === 0
    ? 0
    : likesArray.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map(a => a.likes)
  const maxValue = Math.max(...likes)
  const favorite = blogs.find(blog => blog.likes === maxValue)
  return blogs.length === 0
    ? 0
    : favorite
}

const mostBlogs = (blogs) => { // review this
  const authors = blogs.map(b => b.author)
  const reducer = (acc, val) => {
    acc[val] = (acc[val] || 0 ) + 1
    return acc
  }
  const authorsMap = authors.reduce(reducer, {})
  const highestAuthor = Object.keys(authorsMap).reduce((a, b) => authorsMap[a] > authorsMap[b] ? a : b)
  const authorObj = {
    author: highestAuthor,
    blogs: authorsMap[highestAuthor]
  }
  return authorObj
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}