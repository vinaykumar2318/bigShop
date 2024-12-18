import Product from "../../models/Product";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
    if(req.method=='POST'){
        try {
            for (let i = 0; i < req.body.length; i++) {
                await Product.findByIdAndUpdate(req.body[i]._id, req.body[i]);
            }
            res.status(200).json({ success: "Success" });
        } catch (error) {
            console.error("Error updating products:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else{
        console.error("Invalid request method:", req.method);
        res.status(400).json({ error: "This method is not allowed" });
    }
}

export default connectDb(handler);