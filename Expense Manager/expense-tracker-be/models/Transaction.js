const { Schema, model } = require("mongoose");

const TransactionSchema = new Schema({
    price: {type: Number, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    datetime: {type: String, required: true}
});

const TransactionModel = model('Transaction', TransactionSchema)

module.exports = TransactionModel;