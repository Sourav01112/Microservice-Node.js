const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    desc: String,
    banner: String,
    type: String,
    unit: Number,
    price: Number,
    available: Boolean,
    suplier: String
});

const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel