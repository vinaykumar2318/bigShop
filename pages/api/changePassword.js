import User from "../../models/User";
import connectDb from "../../middleware/mongoose";
require('dotenv').config();
var CryptoJS = require("crypto-js");



export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { passwordData, email } = req.body;
  const oldPass = passwordData.oldPassword;
  const newPass = passwordData.newPassword;

  try {
    let user = await User.findOne({"email": email})
    const bytes = CryptoJS.AES.decrypt(user.password, `${process.env.SECRET_KEY}`);
    let decPass = bytes.toString(CryptoJS.enc.Utf8);

    if(!user){
      return res.status(200).json({ success:false, message: "User not found" });
    }

    if(email==user.email && oldPass == decPass){
        user.password = CryptoJS.AES.encrypt(newPass, `${process.env.SECRET_KEY}`).toString();
        await user.save();
        return res.status(200).json({success:true, message:"🦄 Password changed successfully"});
    } else{
        return res.status(200).json({ success:false, message: "🚨 Current password is incorrect" });
    }
  } catch (error) {
    console.error("Error in changePassword API:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
