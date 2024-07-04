const express = require("express");
const authMiddleware = require("./middlewares/auth");
const ProductModel = require("./models/Product");
var moncon = require("./database/mongo-connect");
const { CUSTOMER_SERVICE } = require("./config");
const { PublishMessage } = require("./utils");



const AddProduct = async (req, res) => {
    try {
        const productSave = new ProductModel(req.body);
        const saveInstance = await productSave.save();
        console.log({ saveInstance })
        res.status(200).send({ msg: "Success", doc: saveInstance })

    } catch (error) {
        console.log({ error })
        res.status(400).send({ msg: "Fail" })
    }
}


const AddWishlistToUserModel = async (req, res, channel) => {
    const { _id } = req.user;

    console.log({ _id });
    try {
        const op = await GetProductPayload(
            _id,
            { productId: req.body._id },
            "ADD_TO_WISHLIST"
        )
        console.log({ op });


        var data = op.data

        PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(op));

        res.status(200).send({ data: data.product, msg: "Success", status: 200 });

    } catch (error) {
        console.log({ error })
        res.status(400).send({ msg: "Fail" })
    }
}


const GetProductPayload = async (userId, { productId, qty }, event) => {

    const product = await ProductModel.findById(productId);

    var payload
    if (product) {
        payload = {
            event: event,
            data: { userId, product, qty: qty ? qty : 1 }
        };


        return payload
    } else {
        payload = 'No product Available'
        return payload
    }

}




var AddProductRoute = (router) => {
    router.post("/add-product", authMiddleware, (req, res) => {
        moncon.connectTodb()
        AddProduct(req, res);
    });
};


var AddWishlistToUserModelRoute = (router, channel) => {
    router.post("/add-wishlist", authMiddleware, (req, res) => {
        moncon.connectTodb()
        AddWishlistToUserModel(req, res, channel);
    });
};


module.exports = {
    AddWishlistToUserModelRoute, AddProductRoute
}



