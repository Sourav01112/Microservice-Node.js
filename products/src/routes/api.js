var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var fs = require("fs");
const { AddProductRoute, AddWishlistToUserModelRoute } = require("../product-api");
const { CreateChannel } = require("../utils");

// Middlewares
router.use(bodyParser.json());
router.use(bodyParser.json({ limit: "100mb" }));
router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

const channel = CreateChannel();



//  user
AddProductRoute(router)
AddWishlistToUserModelRoute(router, channel)


module.exports = router;
