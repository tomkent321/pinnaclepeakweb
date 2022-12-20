const express = require('express')
const router = express.Router()
const {  body, validationResult } = require('express-validator')

// @route GET api/users
// @desc Test route
// @access Public
router.get('/', (req, res) => res.send('user route!'))

// @route POST api/users
// @desc add users route
// @access Public
// router.post('/', 

router.post(
    '/',
    // username must be an email
    // body('username','Please include valid email').isEmail(),
    // password must be at least 5 chars long
    body('password', 'password must be at least 5 chars').isLength({ min: 5 }),
    (req, res) => {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
    //   User.create({
    //     username: req.body.username,
    //     password: req.body.password,
    //   }).then(user => res.json(user));
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
console.log(user)
    res.send(req.body)
    },
  );


module.exports = router
