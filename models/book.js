const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    name:{
        type:String,
        required:[true,'Please provide book name name'],
        maxlength:50,
        minlength:3
    },
    author:{
        type:String,
        required:[true,'Please provide author name'],
        maxlength:50,
        minlength:3
    },
    edition:{
        type: String,
        maxlength:50,
        minlength:3
    },
    ISSBN:{
        type:String,
        length:5,
        required:[true,'Please provide BOOK ISSBN'],
        unique:true
    }

})


module.exports = mongoose.model('BOOK', BookSchema);