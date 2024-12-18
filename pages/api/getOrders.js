import Order from "../../models/Order";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
    try {
        const orders = await Order.find();
        if(!orders.length){
            return res.status(404).json({ message: "No orders corresponding to your account" });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export default connectDb(handler);
