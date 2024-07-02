const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Proxy configuration 

const customerServiceProxy = proxy("http://localhost:8001", {
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    console.log(`Proxying request to: ${proxyReqOpts.path}`);
    return proxyReqOpts;
  },
  proxyReqBodyDecorator: (bodyContent, srcReq) => {
    console.log(`Request body: ${JSON.stringify(bodyContent)}`);
    return bodyContent;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    console.log({ proxyRes });
    console.log(`Response from proxy: ${proxyRes.statusCode}`);
    return proxyResData;
  }
});


const shoppingServiceProxy = proxy("http://localhost:8003", {
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    console.log(`Proxying request to: ${proxyReqOpts.path}`);
    return proxyReqOpts;
  },
  proxyReqBodyDecorator: (bodyContent, srcReq) => {
    console.log(`Request body: ${JSON.stringify(bodyContent)}`);
    return bodyContent;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    console.log({ proxyRes });
    console.log(`Response from proxy: ${proxyRes.statusCode}`);
    return proxyResData;
  }
});

app.use("/customer", customerServiceProxy);
app.use("/shopping", shoppingServiceProxy);
// products
app.use("/", proxy("http://localhost:8002"));


app.listen(PORT, () => {
  console.log(`Gateway is Listening to Port ${PORT}`);
});
