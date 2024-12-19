const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {type: String, required: true, unique:true},
    password : {type: String, required: true}
},{timestamps:true});

mongoose.models = {};
export default mongoose.model("Admin", adminSchema);