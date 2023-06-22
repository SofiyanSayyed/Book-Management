const express = require('express');
const router = express.Router()
const {createUser, loginUser} = require('../controller/userController')
const {createBook, getBooks, updateBook, getBookById, deleteBook} = require('../controller/bookController')
const {addReview, updateReview} = require('../controller/reviewController')

//..........User Apis................................
router.post("/register",createUser)
router.post("/login",loginUser)

//.........Books Apis................................
router.post("/books", createBook)
router.get("/books", getBooks)
router.get("/books/:bookId", getBookById)
router.put("/books/:bookId", updateBook)
router.delete("/books/:bookId", deleteBook)



//........Review Apis................................
router.post("/books/:bookId/review", addReview)
router.put("/books/:bookId/review/:reviewId", updateReview)



router.all("/*", (req, res)=> {
    return res.status(400).send({status: false, message:"Invalid Request"})
}) 

module.exports = router 