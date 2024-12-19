import Product from "../../models/Product";
import Order from "../../models/Order";
import User from "../../models/User";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(3)
        // console.log(recentOrders);
        res.json({
            totalSales: totalSales[0]?.total || 0,
            totalOrders,
            totalProducts,
            totalUsers,
            recentOrders,
        });
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default connectDb(handler);