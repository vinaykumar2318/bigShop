const mongoose = require('mongoose');

const forgotSchema = new mongoose.Schema({
    email: {type: String, required: true},
    token : {type: String, required: true}
},{timestamps:true});

mongoose.models = {};
export default mongoose.model("Forgot", forgotSchema);