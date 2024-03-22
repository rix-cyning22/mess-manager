const mongoose = require("mongoose");
const schema = mongoose.Schema;

const messageSchema = new schema({
    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    },
    posterName: {
        required: true,
        type: String
    },
    posterId: {
        required: true,
        type: String
    },
    edittedAt: String
})

module.exports = mongoose.model("Message", messageSchema);