const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    studentId: {
        required: true,
        type: String
    },
    date: {
        required: true,
        type: String 
    },
    breakfast: [{
            price: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true 
            },
            qty: {
                required: true,
                type: Number 
            },
            tot: {
                required: true,
                type: Number
            }
        }],
    lunch: [{
        price: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true 
        },
        qty: {
            required: true,
            type: Number 
        },
        tot: {
            required: true,
            type: Number
        }
    }],
    dinner: [{
        price: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true 
        },
        qty: {
            required: true,
            type: Number 
        },
        tot: {
            required: true,
            type: Number
        }
    }],
    total: {
        default: 0,
        required: true,
        type: Number 
    }
})

module.exports = mongoose.model("Order", OrderSchema);