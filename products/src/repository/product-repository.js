const mongoose = require('mongoose');
const ProductModel = require('../models/Product');



async function CreateProduct({ name, desc, type, unit, price, available, suplier, banner }) {

    const product = new ProductModel({
        name, desc, type, unit, price, available, suplier, banner
    })

    //    return await ProductModel.findByIdAndDelete('607286419f4a1007c1fa7f40');
    const productResult = await product.save();
    return productResult;
}


async function Products() {
    return await ProductModel.find();
}

async function FindById(id) {
    return await ProductModel.findById(id);
}

async function FindByCategory(category) {
    const products = await ProductModel.find({ type: category });
    return products;
}

async function FindSelectedProducts(selectedIds) {
    const products = await ProductModel.find().where('_id').in(selectedIds.map(_id => _id)).exec();
    return products;
}


module.exports = { CreateProduct, Products, FindById, FindByCategory, FindSelectedProducts }
