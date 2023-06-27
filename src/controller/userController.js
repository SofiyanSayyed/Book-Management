const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {validTitle, validString, validPhone, validEmail, validPassword, validPincode} = require('../utils/validation')



const createUser = async (req, res) => {
    try{
        let data = req.body;
        const {title, name, phone, email, password, address} = data;

        
        
        if(!title || !name || !phone || !email || !password){
            return res.status(400).json({status: false, message: "Provide required data!"})
        }
        if(!validTitle(title)){
            return res.status(400).json({status: false, message: "Title is not valid"});
        }
        if(!validString(name)){
            return res.status(400).json({status: false, message: "Enter Valid Name"});
        }
        if(!validPhone(phone)){
            return res.status(400).json({status: false, message: "Enter Valid Number"});
        }
        if(!validEmail(email)){
            return res.status(400).json({status: false, message: "Enter Valid Email"});
        }

        //if address present
        if(address !== undefined){
            const {street, city, pincode} = address;
            if(typeof address !== 'object' ){
                return res.status(400).json({status:false, message: "Invalid address"})
            }
            if(!street && !city && !pincode){
                return res.status(400).json({status:false, message: "Invalid address"})
            }

            if(!validPincode(pincode)){
                return res.status(400).json({status: false, message: "Invalid pincode"});
            }
        }

        //Check if Email and Phone already exists
        let findEmail = await userModel.findOne({email: email})
        let findPhone = await userModel.findOne({phone: phone})
        if(findEmail !== null){
            return res.status(400).json({status: false, message: "Email already exists"});
        }
        if(findPhone !== null){
            return res.status(400).json({status: false, message: "Phone already exists"});
        }


        if(!validPassword(password)){
            return res.status(400).json({status: false, message: "Password length must be more than 8 & less than 16"});
        }
        
        let user = await userModel.create(data)
        return res.status(201).json({status: true, data: user});

    }
    catch(err) {
        return res.status(500).json({status:false, message: err.message});
    }

}


const loginUser = async (req, res) => { 
    try{
        const {email, password} = req.body

        if(!email){
            return res.status(400).json({status: false, message: "Enter valid email"})
        }
        if(!password){
            return res.status(400).json({status: false, message: "Enter valid password"})
        }

        let user = await userModel.findOne({email: email, password: password})

        if(!user){
            return res.status(401).json({status: false, message: "Invalid email or password"})
        }
        let token = jwt.sign({
            userId : user._id.toString()
        },
        process.env.SECRET_KEY,
        {expiresIn: "24h"}
        )
        res.setHeader('x-api-key', token)
        let decodedToken = jwt.verify(token, process.env.SECRET_KEY)

        const expDate = new Date(decodedToken.exp * 1000);
        const iatDate = new Date(decodedToken.iat * 1000);

        return res.status(200).json({status: true, data:{token: token, userId: decodedToken.userId, exp: expDate.toISOString(), iat: iatDate.toISOString()}})
    }
    catch(err){
        return res.status(500).json({status: false, message: err.message})
    }
    
}



module.exports = {createUser, loginUser}