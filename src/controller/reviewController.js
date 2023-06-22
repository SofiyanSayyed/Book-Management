const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')


const addReview = async (req, res) => {

    let id = req.params.bookId
    let checkBook = await bookModel.findOne({isDeleted: false, _id: id})
    if(checkBook === null){
        return res.status(400).json({status:false, message: "Invalid request, Book id not valid"})
    }
    let data = req.body
    const {review, rating, reviewedBy} = data

    if(!review || !rating){
        return res.status(400).json({status: false, message: "Enter required fields"})
    }
    if(rating < 0 || rating > 5){
        return res.status(400).json({status: false, message:"rating must be in range of 1 to 5"})
    }

    let reviewData = await reviewModel.create({
        bookId: id,
        ...data
    })

    let book = await bookModel.findOneAndUpdate({isDeleted: false, _id: id},{$inc: {reviews: 1}},{new: true}).lean()
    

    book.reviewData = reviewData

    return res.status(201).json({status: true, message: "Review added successfully", data: book});
   

}




const updateReview = async (req, res) => {

    let {reviewId, bookId} = req.params
    let data = req.body
    if(Object.keys(data).length === 0){
        return res.status(400).json({status: false, message: "Enter data"})
    }

    let myBook = await bookModel.findOne({isDeleted: false, _id: bookId}).lean()
    if(myBook === null){
        return res.status(400).json({status: false, message: "Book Not Found"})
    }
    let myReview = await reviewModel.findOneAndUpdate({isDeleted: false, _id: reviewId},{$set: data},{new: true})
    if(myReview === null){
        return res.status(400).json({status: false, message: "review Not Found"})
    }
    let reviewsData = await reviewModel.find({isDeleted: false, bookId: bookId})

    myBook.reviewsData = reviewsData


    return res.status(200).json({status: true, message: "Book review list", data: myBook})

}


module.exports = {addReview, updateReview}