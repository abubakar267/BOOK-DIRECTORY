const BOOKS = require('../models/book')
const { StatusCodes } = require('http-status-codes')

const getAllBooks = async (req,res)=>{
    try {
        const userId = req.user._id; // Get user ID from authenticated user object
        // console.log(userId);
        const books = await BOOKS.find({ userId});
        res.status(StatusCodes.OK).json({ books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching books', error });
    }
}

const getBook = async(req,res) =>{
    try {
        const bookId = req.params.id;
        console.log(bookId);
       
        const book = await BOOKS.findOne({_id: bookId})
        res.status(StatusCodes.OK).json({ book });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching books', error });
    }

}


    const addBook = async (req, res) => {
        const {
            body: { ISSBN,author,edition,name },
            // user: { user },
            
          } = req;

          console.log(req.body);
    
          if (ISSBN === '' || author === '' || edition === '' || name === '') {  
                res.send('these fields cannot be empty')
    }

    try {
                const newBook = await BOOKS.create({ ISSBN, author, edition, name, userId:req.body.user});
                res.status(StatusCodes.OK).json({ book: newBook });
                console.log('book created');

    }catch(error){
        res.status(500).json({ error: 'Failed to add book' });
    }
        };
        
    
    


const updateBook = async (req,res)=>{


    const {
        body: { ISSBN,author,edition,name },
        user: { userId },
        params: { id: bookId },
      } = req;

      if (ISSBN === '' || author === '' || edition === '' || name === '') {  
            res.send('these fields cannot be empty')
}

const book= await BOOKS.findByIdAndUpdate(
    { _id: bookId, userId: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!book) {
    res.send(`No book with id ${bookId}`);
  }
  res.status(StatusCodes.OK).json({ book });
}


const deleteBook = async (req,res)=>{
    try {
        const bookId = req.params.id;
        console.log(bookId);
       
        const book = await BOOKS.findByIdAndDelete({_id: bookId})
        res.status(StatusCodes.OK).json({ book });
    } catch (error) {
        console.error('Error deleting books:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching books', error });
    }
}

module.exports = {
    getAllBooks,
    getBook,
    addBook,
    updateBook,
    deleteBook
}