require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const connectDB = require('./db/connect');


const authRouter = require('./routes/auth');
const bookRouter = require('./routes/book')

const mongoose = require('mongoose');
const Book = require('./models/book');
const authenticateUser = require('./middleware/auth');

app.use(express.json());
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/books',authenticateUser,bookRouter)


app.get('/project', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/project.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/signin.html'));
});

app.get('/home', (req, res) => {
    // Serve your home page or redirect to another route as needed
    res.sendFile(path.resolve(__dirname, './public/home.html'));
});






// const books = [
//     {
//         title: 'Book 4',
//         author: 'Author 5',
//         userId: '6672c79a440ae33fef00e152',
//         ISSBN:'40334',
//         name:'computer science 3' ,
//         edition:'9th edition'
//         // Replace with a valid user ID
//     }]

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        // await Book.create(books);
        // console.log('Seed data inserted successfully');
        app.listen(port, () => {

            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
