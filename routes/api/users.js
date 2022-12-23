const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
require('dotenv').config()
const { MongoClient } = require('mongodb')
const uri = process.env.MONGO_URI
const client = new MongoClient(uri)
const User = require('../../models/User')
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

// @route GET api/users
// @desc Test route
// @access Public
// router.get('/', (req, res) => res.render('userAdd'))

router.get('/', (req, res) => res.render('userAdd'))


// @route POST api/users
// @desc add users route
// @access Public
router.post(
  '/',

  body('unitNumber', 'must include Unit number between 199 and 901')
    .not()
    .isEmpty(),
  body('buildingNumber', 'Must include building number').not().isEmpty(),

  body('userName', 'must not be empty').not().isEmpty(),
  body('password', 'must be at least 5 characters').isLength({ min: 5 }),

  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      unitNumber,
      buildingNumber,
      firstName,
      lastName,
      spouseName,
      userName,
      password,
      phone,
      email,
      address,
      address2,
      city,
      state,
      zip,
      remoteOwner,
      access,
    } = req.body

    const database = client.db('pinnaclecreek')
    const users = database.collection('users')

    console.log('req.body: ', userName, password, unitNumber)
    try {
      // See if user exists already
      // const database = client.db('pinnaclecreek')
      // const users = database.collection('users')
      let user = await users.findOne({ unitNumber })
      // console.log('after find user: ', user)
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'user already exists' }] })
      }

      // Get user Gravator
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })
      console.log(avatar)
      user = new User({
        unitNumber,
        buildingNumber,
        firstName,
        lastName,
        userName,
        password,
        unitNumber,
        buildingNumber,
        firstName,
        lastName,
        spouseName,
        userName,
        password,
        phone,
        email,
        address,
        address2,
        city,
        state,
        zip,
        remoteOwner,
        access,
        avatar: avatar,
        date: Date.now(),
      })
      // Encrypt Password
      const salt = await bcrypt.genSalt(10)

      user.password = await bcrypt.hash(password, salt)
      console.log('user: ', user)
      await users.insertOne(user)
      // await user.save()
      // Return jsonwebtoken

      const payload = {
        user: {
          id: user.id,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          unit: user.unitNumber,
          access: user.access
        },
      }
// console.log(payload)

      jwt.sign(payload, 
        jwtSecret, 
        { expiresIn: 36000 },
        (err, token)=> {
          if(err) throw err
          res.json({ token})
        })

      // res.send('user added')
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    } finally {
      // await client.close()
    }
  }
)

router.get('/list', (req, res) => {
  getUsers()
})

async function getUsers() {
  MongoClient.connect(uri, function (err, db) {
    if (err) throw err
    var dbo = db.db('pinnaclecreek')
    dbo
      .collection('users')
      .find({})
      .toArray(function (err, result) {
        if (err) throw err
        console.log(result)
        return result
        db.close()
      })
  })
}





module.exports = router
