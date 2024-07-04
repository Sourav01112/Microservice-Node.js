const mongoose = require("mongoose");
require('dotenv').config()
const { DB_URL } = require('../config');


mongoose.Promise = global.Promise;

mongoose.set('debug', true);

function connectTodb() {
  var baseURL = DB_URL
  console.log({ baseURL })
  mongoose.connect(baseURL).then(() => {
    console.log("connnected")
  }).catch((err) => {
    console.log(" in mongoose catch", err);
  })

}

module.exports = { connectTodb };
