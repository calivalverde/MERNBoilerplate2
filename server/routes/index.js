const express = require('express');
const router = express.Router();

// Model
//const User = require('../models/user');

// Controllers
//const ensureAuthenticated = require('../controllers/ensureAuthenticated')

router.get('/test', (req, res, next) => {
  res.send('hello world');
});


module.exports = router;
