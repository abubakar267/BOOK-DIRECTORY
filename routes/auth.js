const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');
const authenticateUser = require('../middleware/auth');
router.post('/register', register);
router.post('/login', login);
const Book = require('../models/book');
const User = require('../models/user');
const authfunc = require('../controllers/authenticate');

router.use(authenticateUser);

router.get('/home',authenticateUser,authfunc);

module.exports = router;

    