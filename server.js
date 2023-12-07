let express = require("express");
let cors = require("cors");
let fs = require("fs");


let app = express();  // Creates the server
app.use(cors());  // Tells browsers that we want to allow requests from any domain name
app.use(express.json());  // Enables the server to send and receive JSON data
// app.use(express.urlencoded());  // Enables support for traditional HTML <form> submissions, in which data is sent encoded within the URL, like query parameters


// Listen for GET requests to get all categories
app.get("/api/categories", function (request, response) {
    console.log("Received a GET request for categories");

    let json = fs.readFileSync(`${__dirname}/data/categories.json`, "utf8");
    let allCategories = JSON.parse(json);

    console.log("Returning: ");
    console.log(allCategories);
    
    response.status(200).json(allCategories);
});


// Listen for GET requests to get all products within a given category
app.get("/api/products/bycategory/:categoryId", function (request, response) {
    let categoryId = request.params.categoryId;
    console.log("Received a GET request for products in category " + categoryId);

    let json = fs.readFileSync(`${__dirname}/data/our_products.json`, "utf8");
    let allProducts = JSON.parse(json);

    let matchingProducts = allProducts.filter(p => p.categoryId === categoryId);
    
    console.log("Returning: ");
    console.log(matchingProducts);
    
    response.status(200).json(matchingProducts);
});


// Listen for GET requests to get all products
app.get("/api/products", function (request, response) {
    console.log("Received a GET request for products");

    let json = fs.readFileSync(`${__dirname}/data/our_products.json`, "utf8");
    let allProducts = JSON.parse(json);
    
    console.log("Returning: ");
    console.log(allProducts);
    
    response.status(200).json(allProducts);
});


// Listen for GET requests to get a specific product
app.get("/api/products/:productId", function (request, response) {
    let productId = request.params.productId;
    console.log("Received a GET request for product " + productId);
    
    let json = fs.readFileSync(`${__dirname}/data/our_products.json`, "utf8");
    let allProducts = JSON.parse(json);
    
    let matchingProduct = allProducts.find(p => p.productId === productId);
    
    console.log("Returning: ");
    console.log(matchingProduct);

    response.status(200).json(matchingProduct);
});


let server = app.listen(8081, function () {
    console.log(`App listening at port ${server.address().port}`)
});
