const express = require('express');
const router = express.Router()
const {createUser, loginUser} = require('../controller/userController')
const { authentication, authorisation } = require('../middlewares/auth')
const {createBook, getBooks, updateBook, getBookById, deleteBook, createUrl} = require('../controller/bookController')
const {addReview, updateReview, deleteReview} = require('../controller/reviewController')


//..........User Apis................................
router.post("/register",createUser)
router.post("/login",loginUser)

//.........Books Apis................................
router.post("/createUrl", createUrl)
router.post("/books",authentication, createBook)
router.get("/books",authentication, getBooks)
router.get("/books/:bookId",authentication, getBookById)
router.put("/books/:bookId", authentication, authorisation, updateBook)
router.delete("/books/:bookId", authentication, authorisation, deleteBook)

//........Review Apis................................
router.post("/books/:bookId/review", addReview)
router.put("/books/:bookId/review/:reviewId", updateReview)
router.delete("/books/:bookId/review/:reviewId", deleteReview)



router.all("/*", (req, res)=> {
    return res.status(400).json({status: false, message:"Invalid Request"})
}) 

module.exports = router 