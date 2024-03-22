const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    alias: String,
    timestamp: String,
    breakfast: String,
    lunch: String,
    dinner: String
})

module.exports = mongoose.model("Feedback", feedbackSchema);