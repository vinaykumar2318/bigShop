import Admin from "../../models/Admin";
import connectDb from "../../middleware/mongoose";
require('dotenv').config();
var CryptoJS = require("crypto-js");

var jwt = require('jsonwebtoken');

const handler = async (req, res) => {
    if(req.method=='POST'){
        let admin = await Admin.findOne({"email": req.body.email})
        if(admin){
            const bytes = CryptoJS.AES.decrypt(admin.password, `${process.env.SECRET_KEY}`);
            let decPass = bytes.toString(CryptoJS.enc.Utf8);
            if(req.body.email==admin.email && req.body.password== decPass){
                var token = jwt.sign({email: admin.email}, `${process.env.TOKEN_KEY}`,{
                    expiresIn: "2d"
                });
                res.status(200).json({success:true, token});
            } else{
                res.status(200).json({success:false, error:"Invalid Admin Credentials"});
            }
        } else{
            res.status(200).json({success:false, error:"No account corresponding to this email"});
        }
    } else{
        res.status(400).json({error:"This method is not allowed"});
    }
}

export default connectDb(handler);