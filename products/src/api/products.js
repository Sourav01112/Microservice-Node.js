const { CUSTOMER_SERVICE, SHOPPING_SERVICE } = require("../config");
const ProductService = require("../services/product-service");
// const {
//   PublishCustomerEvent,
//   PublishShoppingEvent,
//   PublishMessage,
// } = require("../utils");
// const UserAuth = require("./middlewares/auth")

const express = require("express");
const productRouter = express.Router();

// module.exports = (app, channel) => {
//   const service = new ProductService();

productRouter.post("/product/create", async (req, res, next) => {
  const { name, desc, type, unit, price, available, suplier, banner } =
    req.body;
  // validation
  const { data } = await CreateProduct({
    name,
    desc,
    type,
    unit,
    price,
    available,
    suplier,
    banner,
  });
  return res.json(data);
});

productRouter.get("/category/:type", async (req, res, next) => {
  const type = req.params.type;

  try {
    const { data } = await GetProductsByCategory(type);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ error });
  }
});

productRouter.get("/:id", async (req, res, next) => {
  const productId = req.params.id;

  try {
    const { data } = await GetProductDescription(productId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ error });
  }
});

productRouter.post("/ids", async (req, res, next) => {
  const { ids } = req.body;
  const products = await GetSelectedProducts(ids);
  return res.status(200).json(products);
});

productRouter.put("/wishlist", async (req, res, next) => {
  const { _id } = req.user;

  const { data } = await GetProductPayload(
    _id,
    { productId: req.body._id },
    "ADD_TO_WISHLIST"
  );

  // PublishCustomerEvent(data);
  PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));

  res.status(200).json(data.data.product);
});

productRouter.delete("/wishlist/:id", async (req, res, next) => {
  const { _id } = req.user;
  const productId = req.params.id;

  const { data } = await GetProductPayload(
    _id,
    { productId },
    "REMOVE_FROM_WISHLIST"
  );
  // PublishCustomerEvent(data);
  PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));

  res.status(200).json(data.data.product);
});

productRouter.put("/cart", async (req, res, next) => {
  const { _id } = req.user;

  const { data } = await ProductService.GetProductPayload(
    _id,
    { productId: req.body._id, qty: req.body.qty },
    "ADD_TO_CART"
  );

  // PublishCustomerEvent(data);
  // PublishShoppingEvent(data);

  PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
  PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));

  const response = { product: data.data.product, unit: data.data.qty };

  res.status(200).json(response);
});

productRouter.delete("/cart/:id", async (req, res, next) => {
  const { _id } = req.user;
  const productId = req.params.id;

  const { data } = await GetProductPayload(
    _id,
    { productId },
    "REMOVE_FROM_CART"
  );

  // PublishCustomerEvent(data);
  // PublishShoppingEvent(data);

  PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
  PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));

  const response = { product: data.data.product, unit: data.data.qty };

  res.status(200).json(response);
});

productRouter.get("/whoami", (req, res, next) => {
  return res
    .status(200)
    .json({ msg: "/ or /products : I am products Service" });
});

//get Top products and category
productRouter.get("/", async (req, res, next) => {
  //check validation
  try {
    const { data } = await ProductService.GetProducts();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ error });
  }
});
// };


module.exports = { productRouter }