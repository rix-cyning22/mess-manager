const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StatSchema = new Schema({
    date: {
        required: true,
        type: String
    },
    breakfast: {
        footfall: Number,
        money: Number
    },
    lunch: {
        footfall: Number,
        money: Number
    },
    dinner: {
        footfall: Number,
        money: Number
    },
    total: {
        required: true,
        type: Number
    }
});

module.exports = mongoose.model("Stat", StatSchema);