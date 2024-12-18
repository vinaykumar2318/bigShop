const mongoose = require('mongoose');
  
const orderSchema = new mongoose.Schema({
    email: {type: String, required: true},
    orderId: {type: String, required: true, unique: true},
    status: {type: String, required: true},
    address: {type: String, required: true},
    pincode: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    amount: {type: Number, required: true},
    products: {
      type: Map,
      of: new mongoose.Schema(
        {
          qty: { type: Number, default: 1 },
          price: { type: Number, required: true },
          name: { type: String, required: true },
          size: { type: String, required: true },
          variant: { type: String, required: true },
          image: { type: String, required: true },
        },
        { _id: false }
      ),
      required: true,
  }
}, {timestamps:true});

mongoose.models = {};
export default mongoose.model("Order", orderSchema);