import Product from "../../models/Product";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
    if(req.method=='POST'){
        const {formData, id } = req.body;
        try {
            await Product.findByIdAndUpdate(id, formData);
            res.status(200).json({ success: true});
        } catch (error) {
            console.error("Error updating products:", error);
            res.status(500).json({ success: false});
        }
    } else{
        console.error("Invalid request method:", req.method);
        res.status(400).json({ error: "This method is not allowed" });
    }
}

export default connectDb(handler);