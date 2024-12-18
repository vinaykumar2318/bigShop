import Forgot from "../../models/Forgot";
import connectDb from "../../middleware/mongoose";
require('dotenv').config();
import nodemailer from "nodemailer";
var CryptoJS = require("crypto-js");


const handler= async(req, res)=>{
    if (req.method === "POST") {
        try {
            const { email, sendEmail } = req.body;

            if (!email) {
              return res.status(400).json({ success: false, message: "🚨 Email is required" });
            }
      
            if (sendEmail) {
              const token = CryptoJS.AES.encrypt(email, `${process.env.CRYPTO_SECRET_KEY}`).toString();

              let forgot = new Forgot({
                email: email,
                token: token
              });
      
              await forgot.save();

              const resetLink = `/forgot?token=${encodeURIComponent(token)}`;
      
              const emailBody = `
                <p>We received a request to reset your password on <strong>bigshop.com</strong>.</p>
                <p>To reset your password, please click the link below:</p>
                <a href="${resetLink}" target="_blank" style="color: #0C82E7;">Click here to reset your password</a>
                <br />
                <p>If you did not request this reset, please ignore this email.</p>
              `;

              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
                },
              });

              const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: "Password Reset Request - bigshop.com",
                html: emailBody,
              };

              await transporter.sendMail(mailOptions);
      
              return res.status(200).json({ success: true, message: "🦄 Password reset email sent successfully!", token:token });
            } else {
              return res.status(400).json({ success: false, message: "🚨 Invalid request" });
            }
          } catch (error) {
            console.error("Error in forgotPassword API:", error);
            return res.status(500).json({ success: false, message: "🚨 Internal server error" });
          }
    } else{
        return res.status(200).json({ success:false, message: "🚨 Error while sending mail"});
    }
}

export default connectDb(handler);