
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');
const Book = require('../models/book');

const jwt = require('jsonwebtoken')


const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.send('No token provided')
  }
  

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { name,userId } = decoded
    req.user = { name,userId}
    const user = await User.findOne({ _id: userId });
    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found' });
    }
    req.user = user; 
    
    
    next()
  } catch (error) {
    res.send('Not authorized to access this route')
  }
}

module.exports = authenticateUser
