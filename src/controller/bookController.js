const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const {uploadFile} = require('../aws/aws')
const moment = require('moment')
const {validString, validObjectId, checkDateFormat} = require('../utils/validation')


const createUrl = async( req, res) => {
    try{
        let files= req.files
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
}

const createBook = async (req, res) => {
    try{
        let data = req.body
        if(!data){
            return res.status(400).json({status: false, message: "Please provide the data"})
        }

        const {title, excerpt, userId, category, subcategory, ISBN, releasedAt} = data


        if(!title || !excerpt || !userId || !category || !subcategory || !ISBN || !releasedAt){
            return res.status(400).json({status:false, message: "Enter all required fields"})
        }

        if(!validString(title)){
            return res.status(400).json({status: false, message: "Invalid Title"})
        }

        let isTitle = await bookModel.findOne({title: title})
        if(isTitle !== null){
            return res.status(400).json({status: false, message: "Same Title exists, Try Different Title"})
        }
        let isISBN = await bookModel.findOne({ISBN: ISBN})
        if(isISBN !== null){
            return res.status(400).json({status: false, message: "Same ISBN exists, Try Different ISBN"})
        }

        if(!validString(excerpt)){
            return res.status(400).json({status: false, message: "Enter valid data in excerpt"});
        }

        if(!validObjectId(userId)){
            return res.status(400).json({status: false, message: "Id is not Valid"});
        }

        if(!checkDateFormat(releasedAt)){
            return res.status(400).json({status: false, message: "Enter date in YYYY-MM-DD"});
        }

        let isId = await userModel.findById(userId);
        if(isId === null){  
            return res.status(400).json({status: false, message: "User not found"});
        }

        if(!validString(category)){
            return res.sataus(400).json({status: false, message: "Category is not valid"})
        }

        if(!validString(subcategory)){
            return res.sataus(400).json({status: false, message: "Subcategory is not valid"})
        }

        let book = await bookModel.create({
            title: data.title.trim(),
            excerpt: data.excerpt.trim(),
            userId: data.userId.trim(),
            subcategory: data.subcategory.trim(),
            category: data.category.trim(),
            ISBN: data.ISBN,
            releasedAt: data.releasedAt
        });

        return res.status(201).json({status: true, data: book})


    }
    catch(err){
        return res.status(500).json({status: false, message: err.message})
    }
    
}



const getBooks = async (req, res) => {
    try{
        let data = req.query
        // let {userId, category, subcategory} = data

        let books = await bookModel.find({$and:[{isDeleted: false}, data]}).sort({title: 1})

        if(books.length< 1){
            return res.status(404).json({status: false, message: "No books found"})
        }

        let resData = books.map(book => ({
            _id : book._id,
            title : book.title, 
            excerpt : book.excerpt,
            userId : book.userId,
            category: book.category,
            reviews: book.reviews,
            releasedAt : book.releasedAt
        }))
        return res.status(200).json({status: true, message:"Books list", data: resData})
    }
    catch(err){
        return res.status(500).json({status: false, message: err.message})
    }
}



const getBookById = async (req, res) => {

    try{
        let id = req.params.bookId
        
        let bookReviews = await reviewModel.find({isDeleted : false, bookId: id})

        let book = await bookModel.findOne({isDeleted: false, _id: id}).lean();

        if(book === null){
            return res.status(404).json({status: false, message: "No book found"})
        }

        book.reviewsData = bookReviews

        return res.status(200).json({status: true, message: "Book and Reviews list", book: book})

    }
    catch(err){
        return res.status(500).json({status: false, message:err.message})
    }
    

}




const updateBook = async (req, res) => {
    try{
        let data = req.body
        let id = req.params.bookId
        const {title, excerpt, ISBN, releasedAt} = data

        if(!title && !excerpt && !ISBN && !releasedAt) {
            return res.status(400).json({status: false, message:"Provide data to update"})
        }

        let isTitle = await bookModel.findOne({title: data.title})
        if(isTitle !== null){
            return res.status(400).json({status: false, message: "Same Title exists, Try with Different Title"})
        }

        let isISBN = await bookModel.findOne({ISBN: data.ISBN})
        if(isISBN !== null){
            return res.status(400).json({status: false, message: "Same ISBN exists, Try with Different ISBN"})
        }

        let book = await bookModel.findOneAndUpdate(
            {isDeleted:false, _id: id},
            {$set: data},
            {new: true}
            )
        if(book === null){
            return res.status(404).json({status:false, message: "No book found or book may deleted"})
        }

        return res.status(200).json({status:true, message: "Success", data: book})
    }
    catch(err){
        return res.status(500).json({status:false, message:err.message});
    }
    

}




const deleteBook = async (req, res) => {

    try{
        let id = req.params.bookId

        if(!validObjectId(id)){
            return res.status(400).json({status: false, message: "Please give valid Id"})
        }
        
        let books = await bookModel.findOneAndUpdate({isDeleted: false, _id: id}, {$set: {isDeleted: true, deletedAt: Date.now()}})
        
        if(books === null){
            return res.status(404).json({status: false, message: "No book found"})
        }
        return res.status(200).json({status: true, message: "Book Deleted Successfully"}) ;
    }
    catch(err){
        return res.status(500).json({status: false, message: err.message})
    }
    

}







module.exports = {createBook, getBooks, updateBook, getBookById, deleteBook, createUrl}