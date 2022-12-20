const express = require('express')
const router = express.Router()


// @route GET api/timeLog
// @desc Test route
// @access Private
router.get('/', (req,res)=> res.send('timeLog route!'))

module.exports = router