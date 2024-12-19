import User from "../../models/User";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
    try {
        const users = await User.find();
        if(!users.length){
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json({users});
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export default connectDb(handler);
