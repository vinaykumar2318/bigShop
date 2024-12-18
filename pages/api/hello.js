// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connectDB from "../../middleware/mongoose";

const handler = async (req, res) => {
  res.status(200).json({ message: "API Route Connected Successfully" });
};

export default connectDB(handler);
