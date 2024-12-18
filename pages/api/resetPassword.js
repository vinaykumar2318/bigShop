import User from "../../models/User";
import connectDb from "../../middleware/mongoose";
require('dotenv').config();
var CryptoJS = require("crypto-js");



export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { password , token } = req.body;

  console.log(password, token)


  try {
    const bytes = CryptoJS.AES.decrypt(token, `${process.env.CRYPTO_SECRET_KEY}`);
    let email = bytes.toString(CryptoJS.enc.Utf8);
    console.log(email);
    let user = await User.findOne({"email": email})
    console.log(user);

    if(!user){
      return res.status(200).json({ success:false, message: "User not found" });
    }
    user.password = CryptoJS.AES.encrypt(password, `${process.env.SECRET_KEY}`).toString();

    await user.save();
    return res.status(200).json({success:true, message:"🦄 Password has been reseted successfully"});
  } catch (error) {
    console.error("Error in changePassword API:", error);
    return res.status(500).json({success:false, message: "Internal Server Error" });
  }
}
