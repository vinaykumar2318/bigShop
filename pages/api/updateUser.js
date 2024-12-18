import User from "../../models/User";
import connectDb from "../../middleware/mongoose";
require('dotenv').config();
var CryptoJS = require("crypto-js");



export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { formData, email } = req.body;

  try {
    let user = await User.findOne({"email": email})

    if(!user){
      return res.status(200).json({ success:false, message: "User not found" });
    }
    user.address = formData.address;
    user.pincode = formData.pincode;
    user.state = formData.state;
    user.city = formData.city;
    user.phone = formData.phone;
    await user.save();
    return res.status(200).json({success:true, message:"🦄 Details updated successfully"});
  } catch (error) {
    console.error("Error in changePassword API:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
