"use strict";

const searchTypeDropdown = document.getElementById("searchTypeDropdown");
const categoryDropdown = document.getElementById("categoryDropdown");
const searchResultsDiv = document.getElementById("searchResults");

window.onload = init;

function init() {
    searchTypeDropdown.onchange = searchTypeDropdownOnChange;
    handleCategoryDropdown();
}

function searchTypeDropdownOnChange() {
    let selectedType = searchTypeDropdown.value;

    if (selectedType === "categoryOption") {
        handleCategoryDropdown();
    } else if (selectedType === "viewAllOption") {
        handleViewAll();
    }
}

function handleCategoryDropdown() {

    clearOutput();

    let selectedType = searchTypeDropdown.value;
    categoryDropdown.style.display = (selectedType == "categoryOption") ? "block" : "none";

    fetchCategories()
        .then(data => {
            // Clear the existing options
            categoryDropdown.innerHTML = "";

            // Add a default option
            let defaultOption = new Option("Select one", "");
            categoryDropdown.appendChild(defaultOption);

            // Populate the dropdown with fetched categories
            for (let category of data) {
                let newOption = new Option(category.name, category.categoryId);
                categoryDropdown.appendChild(newOption);
            }
        })
        .catch(error => {
            console.error("Error fetching categories:", error.message);
        });

    // Add an event listener for the change event
    categoryDropdown.onchange = () => {
        let selectedCategory = categoryDropdown.value;
        if (selectedCategory) {
            handleCategorySelection(selectedCategory);
        }
    };
}

function handleCategorySelection(categoryId) {
    // Fetch products for the selected category
    fetchProductsByCategory(categoryId)
        .then(data => {
            // Display products for the selected category
            displayProducts(data);
        })
        .catch(error => {
            console.error("Error fetching products by category:", error);
        });
}

function fetchProductsByCategory(categoryId) {
    return fetch(`http://localhost:8081/api/products/bycategory/${categoryId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("There was a problem with the network response.");
            }
            return response.json();
        });
}

function fetchCategories() {
    return fetch(`http://localhost:8081/api/categories`)
        .then(response => {
            if (!response.ok) {
                throw new Error("There was a problem with the network response.");
            }
            return response.json();
        });
}

function handleViewAll() {
    categoryDropdown.style.display = "none";

    fetchProducts()
        .then(data => {
            displayProducts(data);
        })
        .catch(error => {
            console.error("Error fetching all products data:", error);
        });
}

function fetchProducts() {
    return fetch("http://localhost:8081/api/products")
        .then(response => {
            if (!response.ok) {
                throw new Error("There was a problem with the network response.");
            }
            return response.json();
        });
}

function sortProductsByName(products) {
    return products.sort((a, b) => {
        const nameA = a.productName.toUpperCase();
        const nameB = b.productName.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
}

function displayProducts(data) {

    clearOutput();

    const sortedProducts = sortProductsByName(data);

    for (const product of sortedProducts) {
        const card = document.createElement('div');
        card.className = 'card';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const productId = document.createElement('h4');
        productId.textContent = "SKU #: " + product.productId;

        const productName = document.createElement('h3');
        productName.textContent = product.productName;

        const unitPrice = document.createElement('p');
        unitPrice.textContent = "Price: " + Number(product.unitPrice).toFixed(2);

        const unitsInStock = document.createElement('p');
        unitsInStock.textContent = "Quantity in Stock: " + product.unitsInStock;

        const supplier = document.createElement('p');
        supplier.textContent = "Product Supplier: " + product.supplier;

        const detailsLink = document.createElement('a');
        detailsLink.href = `productDetails.html?id=${product.productId}`;
        detailsLink.textContent = 'View Details';

        const detailsParagraph = document.createElement('p');
        detailsParagraph.appendChild(detailsLink);

        cardBody.appendChild(productId);
        cardBody.appendChild(productName);
        cardBody.appendChild(unitPrice);
        cardBody.appendChild(unitsInStock);
        cardBody.appendChild(supplier);
        cardBody.appendChild(detailsLink);
        cardBody.appendChild(detailsParagraph);


        card.appendChild(cardBody);
        searchResultsDiv.appendChild(card);

    }
}

function clearOutput() {
    searchResultsDiv.innerHTML = "";
}