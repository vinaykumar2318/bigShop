import Product from "../../models/Product";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
    try {
        const products = await Product.find();
        if(!products.length){
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json({products});
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export default connectDb(handler);
