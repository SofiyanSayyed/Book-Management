const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const {myISBN} = require('../utils/ISBN')
const moment = require('moment')
const {validString, validObjectId} = require('../utils/validation')


const createBook = async (req, res) => {
    try{
        let data = req.body
        if(!data){
            return res.status(400).send({status: false, message: "Please provide the data"})
        }

        const {title, excerpt, userId, category, subcategory} = data

        let ISBN = myISBN()  //Generating unique ISBN and assigning it in ISBN

        if(!title || !excerpt || !userId || !category || !subcategory){
            return res.status(400).send({status:false, message: "Enter all required fields"})
        }

        if(!validString(title)){
            return res.status(400).send({status: false, message: "Invalid Title"})
        }

        let isTitle = await bookModel.findOne({title: title})
        if(isTitle !== null){
            return res.status(400).send({status: false, message: "Same Title exists, Try Different Title"})
        }

        if(!validString(excerpt)){
            return res.status(400).send({status: false, message: "Enter valid data in excerpt"});
        }

        if(!validObjectId(userId)){
            return res.status(400).send({status: false, message: "Id is not Valid"});
        }

        let isId = await userModel.findById(userId);
        if(isId === null){
            return res.status(400).send({status: false, message: "User not found"});
        }

        if(!validString(category)){
            return res.sataus(400).send({status: false, message: "Category is not valid"})
        }

        if(!validString(subcategory)){
            return res.sataus(400).send({status: false, message: "Subcategory is not valid"})
        }

        let releasedAt = moment().format('YYYY-MM-DD');

        let book = await bookModel.create({
            title: data.title.trim(),
            excerpt: data.excerpt.trim(),
            userId: data.userId.trim(),
            subcategory: data.subcategory.trim(),
            category: data.category.trim(),
            ISBN: ISBN,
            releasedAt: releasedAt
        });

        return res.status(201).send({status: true, data: book})


    }
    catch(err){
        return res.status(500).send({status: false, message: err.message})
    }
    
}



const getBooks = async (req, res) => {
    try{
        let data = req.query
        // let {userId, category, subcategory} = data

        let books = await bookModel.find({$and:[{isDeleted: false}, data]}).sort({title: 1})

        if(books.length< 1){
            return res.status(404).send({status: false, message: "No books found"})
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
        return res.status(200).send({status: true, message:"Books list", data: resData})
    }
    catch(err){
        return res.status(500).send({status: false, message: err.message})
    }
}



const getBookById = async (req, res) => {

    let id = req.params.bookId

    
    let bookReviews = await reviewModel.find({isDeleted : false, bookId: id})

    let book = await bookModel.findOne({isDeleted: false, _id: id}).lean();

    if(book === null){
        return res.status(404).json({status: false, message: "No book found"})
    }

    book.reviewsData = bookReviews

    return res.status(200).json({status: true, message: "Book and Reviews list", book: book})

}




const updateBook = async (req, res) => {
    try{
        let data = req.body
        let id = req.params.bookId
        const {title, excerpt} = data

        if(Object.keys(data).length == 0) {
            return res.status(400).send({status: false, message:"Provide data to update"})
        }

        if (!data.hasOwnProperty('title') && !data.hasOwnProperty('excerpt')) {
            return res.status(400).send({status: false, message:"Only title and exerpt can be updated"});
        }

        let isTitle = await bookModel.findOne({title: title})
        if(isTitle !== null){
            return res.status(400).send({status: false, message: "Same Title exists, Try with Different Title"})
        }

        let releasedAt = moment().format('YYYY-MM-DD')
        data.releasedAt = releasedAt
        let ISBN = myISBN()
        data.ISBN = ISBN

        let book = await bookModel.findOneAndUpdate(
            {isDeleted:false, _id: id},
            {$set: data},
            {new: true}
            )
        if(book === null){
            return res.status(404).send({status:false, message: "No book found or book may deleted"})
        }

        return res.status(200).send({status:true, message: "Success", data: book})
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message});
    }
    

}




const deleteBook = async (req, res) => {
    let id = req.params.bookId

    if(!validObjectId(id)){
        return res.status(400).json({status: false, message: "Please give valid Id"})
    }
    
    let books = await bookModel.findOneAndUpdate({isDeleted: false, _id: id}, {isDeleted: true})
    
    if(books === null){
        return res.status(404).json({status: false, message: "No book found"})
    }
    return res.status(200).json({status: true, message: "Book Deleted Successfully"}) ;

}







module.exports = {createBook, getBooks, updateBook, getBookById, deleteBook}