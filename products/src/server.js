const express = require('express');
const app = express();
const { PORT } = require('./config');
const ip = require('ip');
const { productRouter } = require('./api/products');
var moncon = require("./database/mongo-connect")
const cors = require("cors");
const { CreateChannel } = require('./utils');

app.use(express.json());
app.use(cors());
app.use("/", require("./routes/api"))

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});


app.listen(PORT, async () => {
    try {
        await moncon.connectTodb();
        console.log("Mogno Atlas Connected");
        console.log(`Product Sever is running at ${PORT}`);

    } catch (error) {
        console.log("error", error)
        console.log("Mongo connection error");
    }
})
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
    .on('close', () => {
        console.log("close err");

    })
console.log("product is running on ip " + ip.address())
