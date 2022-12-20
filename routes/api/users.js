const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
require('dotenv').config()
const { MongoClient } = require('mongodb')
const uri =   process.env.MONGO_URI
const client = new MongoClient(uri)
const mongoose = require('mongoose')

// @route GET api/users
// @desc Test route
// @access Public
router.get('/', (req, res) => res.render('userAdd'))

// @route POST api/users
// @desc add users route
// @access Public
router.post(
  '/',
  // username must be an email
  // body('username','must not be empty').not().isEmpty(),
  // password must be at least 5 chars long
  body('password', 'must be at least 5 characters').isLength({ min: 5 }),
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const user = {

      unitNumber: req.body.unitNumber,
      buildingNumber: req.body.buildingNumber,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      spouseName: req.body.spouseName,
      userName: req.body.userName,
      password: req.body.password,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      remoteOwner: !req.body.remoteOwner ? false : true,
      access: req.body.access,
    }
    
    addUser(user).catch(console.dir)
    // res.redirect('/')

    res.send(req.body)
  }
)

async function addUser(user) {
  try {
    const database = client.db('pinnaclecreek')
    const users = database.collection('users')
    // create a document to insert
    const thisUser = {
      unitNumber: user.unitNumber,
      buildingNumber: user.buildingNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      spouseName: user.spouseName,
      userName: user.userName,
      password: user.password,
      phone: user.phone,
      email: user.email,
      address: user.address,
      address2: user.address2,
      city: user.city,
      state: user.state,
      zip: user.zip,
      remoteOwner: user.remoteOwner,
      access: user.access,
    }
    const result = await users.insertOne(thisUser)
    console.log(`A user was added with the _id: ${result.insertedId}`)
  } finally {
    // await client.close()
  }
}



module.exports = router
