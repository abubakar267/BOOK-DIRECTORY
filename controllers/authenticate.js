
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');
const Book = require('../models/book');



const authfunc = async (req, res) => {
    try {
        // req.user contains the authenticated user object
        const user = req.user;
        // const book = req.books;
        res.status(StatusCodes.OK).json({ user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching user data', error });
    }
}

module.exports = authfunc