import User from "../../models/User";
import connectDb from "../../middleware/mongoose";
require('dotenv').config();
var CryptoJS = require("crypto-js");

var jwt = require('jsonwebtoken');

const handler = async (req, res) => {
    if(req.method=='POST'){
        let user = await User.findOne({"email": req.body.email})
        if(user){
            const bytes = CryptoJS.AES.decrypt(user.password, `${process.env.SECRET_KEY}`);
            let decPass = bytes.toString(CryptoJS.enc.Utf8);
            if(req.body.email==user.email && req.body.password== decPass){
                var token = jwt.sign({email: user.email, name: user.username}, `${process.env.TOKEN_KEY}`,{
                    expiresIn: "2d"
                });
                res.status(200).json({success:true, token});
            } else{
                res.status(200).json({success:false, error:"Invalid Credentials"});
            }
        } else{
            res.status(200).json({success:false, error:"No account corresponding to this email"});
        }
    } else{
        res.status(400).json({error:"This method is not allowed"});
    }
}

export default connectDb(handler);