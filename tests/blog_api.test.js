const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for(let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('when initial blogs are saved', () => {
  var headers
  beforeEach(async () => {
    const user = {
      username: 'tester',
      name: 'test',
      password: 'testing'
    }

    await api
      .post('/api/users')
      .send(user)

    const result = await api
      .post('/api/login')
      .send(user)

    headers = {
      'Authorization': `bearer ${result.body.token}`
    }
  })

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set(headers)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blog post has unique identifier', async () => {
    const response = await api
      .get('/api/blogs')
      .set(headers)

    expect(response.body[0].id).toBeDefined()
  })
})

describe('posting a blog', () => {
  var headers
  beforeEach(async () => {
    const user = {
      username: 'tester',
      name: 'test',
      password: 'testing'
    }

    await api
      .post('/api/users')
      .send(user)

    const result = await api
      .post('/api/login')
      .send(user)

    headers = {
      'Authorization': `bearer ${result.body.token}`
    }
  })
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Testing new blog can be added',
      author: 'SuperTest Author',
      url: 'www.supertest.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .set(headers)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'Testing new blog can be added'
    )
  })
})


describe('data property validation', () => {
  var headers
  beforeEach(async () => {
    const user = {
      username: 'tester',
      name: 'test',
      password: 'testing'
    }

    await api
      .post('/api/users')
      .send(user)

    const result = await api
      .post('/api/login')
      .send(user)

    headers = {
      'Authorization': `bearer ${result.body.token}`
    }
  })
  test('empty likes property defaults to zero', async () => {
    const newBlog = {
      title: 'Another test blog',
      author: 'SuperTest Author',
      url: 'www.supertest.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')
      .set(headers)

    console.log(response)

    const newBlogResponse = response.body[2]

    expect(newBlogResponse.likes).toBe(0)
  })

  test('missing title and url yields 400 status code', async () => {
    const newBlog ={
      author: 'Supertest Author'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  var headers
  beforeEach(async () => {
    const user = {
      username: 'tester',
      name: 'test',
      password: 'testing'
    }

    await api
      .post('/api/users')
      .send(user)

    const result = await api
      .post('/api/login')
      .send(user)

    headers = {
      'Authorization': `bearer ${result.body.token}`
    }
  })
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(headers)
      .expect(204)


    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})