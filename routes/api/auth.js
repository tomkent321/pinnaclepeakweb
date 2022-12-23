const express = require('express')
const router = express.Router()
const auth = require('../../middlewear/auth.js')
const { MongoClient } = require('mongodb')
const uri = process.env.MONGO_URI
const client = new MongoClient(uri)
const User = require('../../models/User')
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET


// @route GET api/auth
// @desc Test route
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const database = client.db('pinnaclecreek')
    const users = database.collection('users')
    const result = await users.findOne({ unitNumber: req.user.unit })

    res.json(result)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route POST api/auth/login
// @desc user login
// @access Public
router.post('/login', async (req,res) => {

   const {userName, password} = req.body

   try {
    const database = client.db('pinnaclecreek')
    const users = database.collection('users')
    const result = await users.findOne({ userName: userName })


    if (!result) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid User name' }] })
      } 

    //   res.json(result.userName)
    const match = await bcrypt.compare(password, result.password);

    if(match) {
        const payload = {
            user: {
              id: result.id,
              userName: result.userName,
              lastName: result.lastName,
              unit: result.unitNumber,
              access: result.access
            },
          }
    // console.log(payload)
    
          jwt.sign(payload, 
            jwtSecret, 
            { expiresIn: 36000 },
            (err, token)=> {
              if(err) throw err
            //   res.json({ token})
            //   const newToken = json({ token})
              const newToken =  token
              console.log(newToken)
            })
        //  res.redirect('/home')
         res.render('home', {
            firstName: result.firstName,
            lastName: result.lastName,
            unit: result.unitNumber
           
          })
    } else {
        return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid Password' }] })
        
    }





  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }












//    const checker = async function checkUser(username, password) {
//     const database = client.db('pinnaclecreek')
//     const users = database.collection('users')
//     const result = await users.findOne({ unitNumber: req.user.unit })
// console.log(result)
//     // const userPassword = req.user.password
//     console.log(userPassword)
//     // const match = await bcrypt.compare(password, user.passwordHash);

//     // if(match) {
//     //     //login
//     // }

//     //...

 




   
    // res.send(`${userName}  ${password}`)
})




module.exports = router
