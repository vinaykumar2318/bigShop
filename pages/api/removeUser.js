import User from "../../models/User";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
    if(req.method=='DELETE'){
        const { id } = req.body;
        try {
            await User.findByIdAndDelete(id);
            res.status(200).json({ success: true});
        } catch (error) {
            console.error("Error removing user:", error);
            res.status(500).json({ success: false});
        }
    } else{
        console.error("Invalid request method:", req.method);
        res.status(400).json({ error: "This method is not allowed" });
    }
}

export default connectDb(handler);