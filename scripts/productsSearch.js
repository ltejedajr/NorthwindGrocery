"use strict";

const searchTypeDropdown = document.getElementById("searchTypeDropdown");
const searchByCategory = document.getElementById("searchByCategory");
const viewAll = document.getElementById("viewAll");
const categoryDropdown = document.getElementById("categoryDropdown");
const searchResultsDiv = document.getElementById("searchResults");

window.onload = init;


function init() {

    searchTypeDropdown.onchange = searchTypeDropdownOnChange;

    categoryDropdown.style.display = "none";

}

function searchTypeDropdownOnChange() {
    let selectedType = searchTypeDropdown.value;

    if (selectedType === "searchByCategory") {
        categoryDropdownPopulate(searchTypeDropdown, categoryDropdown);
    }
    else if (selectedType === "viewAll") {
        viewAllOption(searchTypeDropdown);
        categoryDropdown.style.display = "none";
    }
}

function handleCategoryDropdown(searchTypeDropdown, categoryDropdown) {

    let productList = searchTypeDropdown.value;

    categoryDropdown.style.display = (productList == "searchByCategory") ? "block" : "none";

    fetch(`http://localhost:8081/api/categories`)
        .then(response => response.json())
        .then(data => {
            categoryDropdownPopulate(data);

            for (let category of data) {
                let newOption = new Option(category.name, category.categoryId);
                categoryDropdown.appendChild(newOption);
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error)
        });
}

function categoryDropdownPopulate() {
    categoryDropdown.onchange = () => {
        const categoryIdSelected = categoryDropdown.value;
        console.log(`Selected Category ID: ${categoryIdSelected}`);

        fetch(`http://localhost:8081/api/products/bycategory/${categoryIdSelected}`)
            .then((productResponse) => {
                if (!productResponse.ok) {
                    throw new Error("There was a problem with the network response.");
                }
                return productResponse.json();
            })
            .then((productData) => {
                console.log(`Products for selected category ${categoryIdSelected}:`, productData);
                productDataPopulate(productData);
            })
            .catch((error) => {
                console.error("Error fetching products by category:", error);
            });
    };

}

function productDataPopulate(productData) {

    clearOutput();

    for (const product of productData) {
        const card = document.createElement('div');
        card.className = 'card';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const productName = document.createElement('h4');
        productName.textContent = product.productName;

        const unitPrice = document.createElement('p');
        unitPrice.textContent = Number(product.unitPrice).toFixed(2);

        const unitsInStock = document.createElement('p');
        unitsInStock.textContent = product.unitsInStock;

        const supplier = document.createElement('p');
        supplier.textContent = product.supplier;

        cardBody.appendChild(productName);
        cardBody.appendChild(unitPrice);
        cardBody.appendChild(unitsInStock);
        cardBody.appendChild(supplier);

        card.appendChild(cardBody);
        searchResultsDiv.appendChild(card);

    }
}

function viewAllOption() {
    fetch("http://localhost:8081/api/products")
        .then(productResponse => {
            if (!productResponse.ok) {
                throw new Error("There was a problem with the network response.");
            }
            return productResponse.json();
        })
        .then(data => {
            let sortedProducts = viewAllSort(data);
            viewAllPopulate(sortedProducts);
        })
        .catch(error => {
            console.error("Error fetching all products data:", error);
        });
}

function viewAllSort(data) {
    return data.sort((a, b) => a.productName.toLowerCase() < b.productName.toLowerCase() ? -1 : 1);
}


function viewAllPopulate(data) {
    
    clearOutput();

    for (const product of data) {
        const card = document.createElement('div');
        card.className = 'card';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const productName = document.createElement('h4');
        productName.textContent = product.productName;

        const unitPrice = document.createElement('p');
        unitPrice.textContent = Number(product.unitPrice).toFixed(2);

        const detailsLink = document.createElement('a');
        detailsLink.href = `details.html?id=${product.productId}`;
        detailsLink.textContent = 'View Details';

        const detailsParagraph = document.createElement('p');
        detailsParagraph.appendChild(detailsLink);

        cardBody.appendChild(productName);
        cardBody.appendChild(unitPrice);
        cardBody.appendChild(detailsLink);
        cardBody.appendChild(detailsParagraph);


        card.appendChild(cardBody);
        searchResultsDiv.appendChild(card);
        
    }
}

function clearOutput() {
    searchResultsDiv.innerHTML = '';
}

// function categorySort(a, b) {
//     if (a.name < b.name) {
//         return -1;
//     } else if (a.name == b.name) {
//         return 0;
//     } else {
//         return 1;
//     }
// }

