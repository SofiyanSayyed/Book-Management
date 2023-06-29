const validator = require('validator');
const mongoose = require('mongoose');


const validTitle = (title) => {
    let arr = ["Mr", "Mrs", "Miss"]
    if(arr.includes(title)) return true
    false
}

const validString = (value) =>{
    if(typeof value == 'undefined' || value === null) return false;
    if(typeof value === 'string' && value.trim().length === 0) return false;
    return true;
}

validPhone = (value) =>{
    let stringValue = value.toString();
    if(stringValue.trim().length < 10) return false
    if(!validator.isMobilePhone(stringValue)) return false
    return true
    
}

const validEmail = (value) =>{
    if(!validator.isEmail(value)) return false
    return true;
}

const validPassword = (value) =>{
    if(typeof value === 'string' && value.trim().length < 8 || value.trim().length > 15 ) return false;
    return true
}

const validPincode = (value) => {
    let stringValue = value.toString();
    if(stringValue.trim().length !== 6) return false
    return true
}

const validObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}

const checkDateFormat = (date) =>{
    return /^\d{4}-\d{2}-\d{2}$/.test(date)
}




module.exports = {validTitle, validString, validPhone, validEmail, validPassword, validPincode, validObjectId, checkDateFormat}
