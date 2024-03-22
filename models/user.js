const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
    userId: {
        type: String,
        required: true 
    },
    userType: {
        type:String,
        required: true 
    },
    alias: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true 
    },
    lastOrdered: String
});

module.exports = mongoose.model("User", UserSchema);