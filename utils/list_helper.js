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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}