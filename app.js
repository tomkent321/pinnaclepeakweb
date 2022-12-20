const express = require('express')
const app = express()
const ejs = require('ejs')
const _ = require('lodash')
const router = express.Router()
require('dotenv').config()
const { MongoClient } = require('mongodb')
const uri =   process.env.MONGO_URI
const client = new MongoClient(uri)
const mongoose = require('mongoose')

app.use(express.urlencoded({ extended: true }))
app.use(express.json({extended: false}))
app.set('view engine', 'ejs')

app.use(express.static('public'))




// Define routes

app.use('/api/users', require('./routes/api/users') )
app.use('/api/auth', require('./routes/api/auth') )
app.use('/api/timeLog', require('./routes/api/timeLog') )




















var posts = []
getAllPosts(posts)

// app.get('/', (req, res) => {
//   res.render('home', {
//     homeStartingContent: homeStartingContent,
//     posts: posts,
//   })
// })

app.get('/', (req, res) => {
  res.render('cover')
})

// router.get('/users', (req, res) => {
//   res.render('userAdd')
// })

// app.post('/useradd', (req, res) => {
  
//   const user = {

//     unitNumber: req.body.unitNumber,
//     buildingNumber: req.body.buildingNumber,
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     spouseName: req.body.spouseName,
//     userName: req.body.userName,
//     password: req.body.password,
//     phone: req.body.phone,
//     email: req.body.email,
//     address: req.body.address,
//     address2: req.body.address2,
//     city: req.body.city,
//     state: req.body.state,
//     zip: req.body.zip,
//     remoteOwner: !req.body.remoteOwner ? false : true,
//     access: req.body.access,
//   }
  
//   addUser(user).catch(console.dir)
//   res.redirect('/')

//   // console.log(user)
// })




app.get('/about', (req, res) => {
  res.render('about', { aboutContent: aboutContent })
})

app.get('/login' , (req, res)=> {
  res.render('login')
})

app.post('/login' ,(req, res)=>{

  const login = {
    userName: req.body.userName,
    password: req.body.password
  }

  console.log(login)
} )


app.get('/contact', (req, res) => {
  res.render('contact', { contactContent: contactContent })
})

app.get('/cover', (req, res) => {
  res.render('cover')
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

app.get('/test', (req, res) => {
  res.render('test')
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
const PORT = process.env.PORT || 3000

// app.listen(3000, function () {
//   console.log('Server started on port 3000')
// })

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`))