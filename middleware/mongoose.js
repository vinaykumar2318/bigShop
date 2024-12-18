// require('dotenv').config();
// const mongoose = require('mongoose');

// const connectDB = (handler) => async (req, res) => {
//     try {
//         if (mongoose.connections[0].readyState) {
//             console.log("Using existing database connection");
//             return handler(req, res);
//         }

//         await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI);
//         console.log("Connected to Database Successfully");
//         return handler(req, res);
//     } catch (err) {
//         console.error("MongoDB connection error:", err);
//         res.status(500).json({ error: "Database Connection Failed" });
//     }
// };

// export default connectDB;


require('dotenv').config();
import mongoose from 'mongoose';

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("🚨 Please define the NEXT_PUBLIC_MONGODB_URI environment variable in .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = (handler) => async (req, res) => {
  if (cached.conn) {
    return handler(req, res);
  }

  if (!cached.promise) {
    console.log("🚀 Connecting to MongoDB...");
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ Connected to MongoDB Successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return handler(req, res);
  } catch (err) {
    res.status(500).json({ error: "Database Connection Failed" });
  }
};

export default connectDB;