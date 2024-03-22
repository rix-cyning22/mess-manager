const mongoose = require("mongoose");
const schema = mongoose.Schema;

const MenuSchema = new schema({
    day: {
        type: String,
        required: true
    },
    breakfast: {
        type: Array,
        required: true
    },
    lunch: {
        type: Array,
        required: true
    },
    dinner: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model("Menu", MenuSchema);