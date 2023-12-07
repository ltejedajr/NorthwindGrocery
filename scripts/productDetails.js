"use strict";

window.onload = () => {
    const productId = getUrlParam('id');
    fetchProducts(productId);
}

function fetchProducts(productId) {
    fetch(`http://localhost:8081/api/products/${productId}`)
        .then(response => response.json())
        .then(productData => {
            console.log(productData);
            displayProduct(productData);
        })
        .catch(error => console.error(`Not fetching`, error));
}

function displayProduct(productData) {
    const productDetails = document.getElementById("productDetails");

    const card = document.createElement('div');
    card.className = 'card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const productName = document.createElement('h4');
    productName.textContent = productData.productName;

    const unitPrice = document.createElement('p');
    unitPrice.textContent = "Price: " + Number(productData.unitPrice).toFixed(2);

    const unitsInStock = document.createElement('p');
    unitsInStock.textContent = "Quantity in Stock: " + productData.unitsInStock;

    const discontinued = document.createElement('p');
    discontinued.textContent = "Discontinued: " + (productData.discontinued === "true" ? "Yes" : "No");

    cardBody.appendChild(productName);
    cardBody.appendChild(unitPrice);
    cardBody.appendChild(unitsInStock);
    cardBody.appendChild(discontinued);

    card.appendChild(cardBody);
    productDetails.appendChild(card);
}

function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

