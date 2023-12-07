"use strict";

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    fetchProductApi(productId);
}

function fetchProductApi(productId) {
    fetch(`http://localhost:8081/api/products/${productId}`)
        .then(response => response.json())
        .then(productData => {
            console.log(productData)
            displayProduct(productData)
        })
        .catch(error => console.error(`Not fetching`, error));
}

function displayProduct(productData) {
    const productDetails = document.getElementById("productDetails");

    productDetails.innerHTML = `
    <div class="">
        <div class="card">
            <div class="card-body">
                <h4>${productData.productName}</h4>
                <p>${Number(productData.unitPrice).toFixed(2)}</p>
                <p>${(productData.unitsInStock)}</p>
                <p>${productData.discontinued}</p>
            </div>   
        </div>
    </div>
      
    `;
}