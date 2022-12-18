const express = require('express')
const app = express()
const ejs = require('ejs')
const _ = require('lodash')

const { MongoClient } = require('mongodb')
const uri =
  'mongodb+srv://tomkent321:tomkentABC@cluster0.gcmm6.mongodb.net/custom-blog?retryWrites=true&w=majority'
const client = new MongoClient(uri)
const mongoose = require('mongoose')

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('public'))

const homeStartingContent =
  "You would think that by now I would have learned something. But sometimes I don't think I've learned anything at all, except what I don't know. Maybe that's a good thing.  I know that I didn't create myself, that I don't have control over how long I will live, that I certainly can't save myself, that people in this life are fleeting, that it is extremely scary to really love someone because they are far too vulnerable.  The only hope, the only thing that can make this life at all bearable is the hope that God will have mercy on us.  That he will make everything right and will redeem everything and that all of those that I worry and fret about are really under his care and that none will be lost. There isn't really any other reason to live in this life otherwise. But now you know what the tenor of these entries will be. Read at your own risk. I'm not terribly happy or optimistic right now."
const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.'
const contactContent =
  'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.'

var posts = []
getAllPosts(posts)

app.get('/', (req, res) => {
  res.render('home', {
    homeStartingContent: homeStartingContent,
    posts: posts,
  })
})

app.get('/about', (req, res) => {
  res.render('about', { aboutContent: aboutContent })
})

app.get('/contact', (req, res) => {
  res.render('contact', { contactContent: contactContent })
})

app.get('/post', (req, res) => {
  res.render('post', { posts: post })
})

app.get('/compose', (req, res) => {
  res.render('compose')
})

app.get('/update', (req, res) => {
  res.render('update')
})

app.post('/compose', (req, res) => {
  let postTrunc = _.truncate(req.body.postContent, {
    length: 100,
    separator: /,? +/,
  })

  const post = {
    title: req.body.postTitle,
    post: req.body.postContent,
    trunc: postTrunc,
    time: '17:45pm',
    link: `/posts/${_.lowerCase(req.body.postTitle)}`,
  }

  posts.push(post)
  insertPost(post).catch(console.dir)
  res.redirect('/')
})

// get just one specific post
app.get('/posts/:postName', (req, res) => {
  const requestedTitle = _.lowerCase(req.params.postName)
  let onePost = {}
  posts.forEach((post) => {
    const storedTitle = _.lowerCase(post.title)
    if (storedTitle === requestedTitle) {
      onePost = {
        title: post.title,
        post: post.post,
        time: post.time,
        link: post.link,
      }
    }
  })

  res.render('post', { post: onePost })
})

// DB interface functions

async function insertPost(post) {
  try {
    const database = client.db('custom-blog')
    const entries = database.collection('entries')
    // create a document to insert
    const thisPost = {
      title: post.title,
      post: post.post,
      time: post.time,
      link: post.link,
    }
    const result = await entries.insertOne(thisPost)
    console.log(`A document was inserted with the _id: ${result.insertedId}`)
  } finally {
    // await client.close()
  }
}

async function getAllPosts() {
  try {
    const database = client.db('custom-blog')
    const entries = database.collection('entries')
    // query for movies that have a runtime less than 15 minutes
    // const query = { runtime: { $lt: 15 } };
    const query = {}
    const options = {
      // sort returned documents in ascending order by title (A->Z)
      sort: { title: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      projection: { _id: 0, title: 1, post: 1, time: 1, link: 1 },
    }
    const cursor = entries.find(query, options)
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      console.log('No documents found!')
    }
    // replace console.dir with your callback to access individual elements
    // await cursor.forEach(console.dir);

    await cursor.forEach((post) => {
      let pushPost = {
        title: post.title,
        post: post.post,
        time: post.time,
        link: post.link,
      }
      // console.log('pushPost: ', pushPost)
      posts.push(pushPost)
    })
    // console.log('posts: ', posts)
  } finally {
    // await client.close();
  }
}
// getAllPosts()
function updatePost(post) {
  console.log(post)
}

async function updatePost(post) {
  try {
    const database = client.db('custom-blog')
    const entries = database.collection('entries')
    // create a filter for a movie to update
    const filter = { title: e.title }
    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true }
    // create a document that sets the plot of the movie

    // display the old post in an editable form and save

    //get the updated data here

    const updateDoc = {
      $set: {
        title: `new title`,
        post: `A harvest of random numbers, such as: ${Math.random()}`,
      },
    }
    const result = await movies.updateOne(filter, updateDoc, options)
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    )
  } finally {
    await client.close()
  }
}
// run().catch(console.dir);

// run().catch(console.dir);

app.listen(3000, function () {
  console.log('Server started on port 3000')
})
