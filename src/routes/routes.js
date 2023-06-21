const express = require('express');
const router = express.Router()
const {createUser, loginUser} = require('../controller/userController')
const {createBook, getBooks, updateBook} = require('../controller/bookController')

//..........User Apis................................
router.post("/register",createUser)
router.post("/login",loginUser)

//.........Books Apis................................
router.post("/books", createBook)
router.get("/books", getBooks)
// router.get("/books/:bookId", getBooksById)
router.put("/books/:bookId", updateBook)



router.all("/*", (req, res)=> {
    return res.status(400).send({status: false, message:"Invalid Request"})
}) 

module.exports = router 