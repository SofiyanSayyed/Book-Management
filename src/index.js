const express = require('express');
const mongoose = require('mongoose')
const route = require('./routes/routes')
const multer = require('multer');
require('dotenv').config();
const {MONGO_STRING, PORT} = process.env
const app = express()

app.use(express.json())

app.use(multer().any())

app.use('/', route)

mongoose.connect(MONGO_STRING,{
    useNewUrlParser: true
})
.then(()=> console.log("MongoDB Connected") )
.catch(err=> console.log(err.message))

app.listen(PORT,()=>{
    console.log('listening on port:',PORT)
})