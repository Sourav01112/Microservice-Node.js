const { Products, FindByCategory, FindSelectedProducts } = require("../repository/product-repository");
const { FormateData } = require("../utils");

// All Business logic will be here
// class ProductService {

//     constructor(){
//         this.repository = new ProductRepository();
//     }


async function CreateProduct(productInputs) {

    const productResult = await CreateProduct(productInputs)
    return FormateData(productResult);
}

async function GetProducts() {
    const products = await Products();

    let categories = {};

    products.map(({ type }) => {
        categories[type] = type;
    });

    return FormateData({
        products,
        categories: Object.keys(categories)
    })

}

async function GetProductDescription(productId) {

    const product = await FindById(productId);
    return FormateData(product)
}

async function GetProductsByCategory(category) {

    const products = await FindByCategory(category);
    return FormateData(products)

}

async function GetSelectedProducts(selectedIds) {

    const products = await FindSelectedProducts(selectedIds);
    return FormateData(products);
}

async function GetProductPayload(userId, { productId, qty }, event) {

    const product = await FindById(productId);

    if (product) {
        const payload = {
            event: event,
            data: { userId, product, qty }
        };

        return FormateData(payload)
    } else {
        return FormateData({ error: 'No product Available' });
    }

}


// }

module.exports = { GetProducts, CreateProduct, GetProductDescription, GetProductPayload }
