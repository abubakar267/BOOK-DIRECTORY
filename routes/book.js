const express = require('express')

const router = express.Router()
const authenticateUser = require('../middleware/auth');

// Protect all routes in this router with authentication middleware
router.use(authenticateUser);
const {getAllBooks,
    getBook,
    addBook,
    updateBook,
    deleteBook} = require('../controllers/book')

    router.route('/').get(getAllBooks).post(addBook)
    router.route('/:id').get(getBook).delete(deleteBook).patch(updateBook)

    module.exports = router

    