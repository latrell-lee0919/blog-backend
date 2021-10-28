const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Test1',
    author: 'Latrell test',
    url: 'www.test.com',
    likes: 2
  },
  {
    title: 'Test2',
    author: 'Kenia test',
    url: 'http://www.test.com',
    likes: 3
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}