import User from "../../models/User";
import connectDb from "../../middleware/mongoose";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const userT = jwt.verify(token, process.env.TOKEN_KEY);
        if(!userT){
            return res.status(404).json({ error: "User not found" });
        }

        const user = await User.findOne({"email": userT.email});

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching the user:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default connectDb(handler);
