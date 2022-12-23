const express = require('express')
const app = express()
const ejs = require('ejs')
const _ = require('lodash')
const router = express.Router()
require('dotenv').config()
const { MongoClient } = require('mongodb')
const uri =   process.env.MONGO_URI
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
// const mongoose = require('mongoose')

app.use(express.urlencoded({ extended: true }))
app.use(express.json({extended: false}))
app.set('view engine', 'ejs')

app.use(express.static('public'))



// async function listDatabases(client){
//   databasesList = await client.db().admin().listDatabases();

//   // console.log("Databases:");
//   // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

// var MongoClient = require('mongodb').MongoClient;


// MongoClient.connect(uri, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("pinnaclecreek");
//   dbo.collection("users").find({}).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });
// });




// main().catch(console.error);


// Define routes

app.get('/', (req, res) => {
  res.render('cover')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/home', (req, res) => {
  res.render('home')
})

app.use('/api/users', require('./routes/api/users') )
app.use('/api/auth', require('./routes/api/auth') )
app.use('/api/timeLog', require('./routes/api/timeLog') )


app.get('/', (req, res) => {
  res.render('home', {
    welcomeName: homeStartingContent,
   
  })
})






const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`))