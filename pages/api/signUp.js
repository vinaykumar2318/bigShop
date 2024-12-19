import User from "../../models/User";
import connectDb from "../../middleware/mongoose";
var CryptoJS = require("crypto-js");
require('dotenv').config();

const handler = async (req, res) => {
    if(req.method==='POST'){
        try {
            const {username, email, password, address, pincode, city, state, phone} = req.body;
            let u = new User({username, email, password:CryptoJS.AES.encrypt(req.body.password, `${process.env.SECRET_KEY}`).toString(), address, pincode, city, state, phone});
            await u.save();
            if(u){
                return res.status(200).json({success:true});
            }
            return res.status(200).json({success:false});
        } catch (error) {
            return res.status(200).json({success:false});
        }
    } else{
        res.status(400).json({success:false, error:"This method is not allowed"});
    }
}

export default connectDb(handler);