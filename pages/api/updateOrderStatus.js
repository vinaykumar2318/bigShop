import Order from "../../models/Order";
import connectDb from "../../middleware/mongoose";
require('dotenv').config();



const handler = async (req, res)=>{
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { orderId, status } = req.body;

  try {
    let order = await Order.findOne({"orderId": orderId})

    if(!order){
      return res.status(200).json({ success:false, message: "Order not found" });
    }
    order.status = status;
    await order.save();
    return res.status(200).json({success:true});
  } catch (error) {
    console.error("Error in changing status", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default connectDb(handler);
