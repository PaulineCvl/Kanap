// Récupération de l'url de la page produit
const queryStringUrl = window.location.search;

// Extraction de l'id
const urlSearchParams = new URLSearchParams(queryStringUrl);
const productId = urlSearchParams.get('id');

// URL de l'API d'un produit
let productsURL = 'http://localhost:3000/api/products/'+ productId;

// Récupération des balises pour insérer les informations du produit
const tabTitle = document.querySelector('title');
const imgSection = document.querySelector('.item__img');
const title = document.getElementById('title');
const price = document.getElementById('price');
const description = document.getElementById('description');
const colorChoice = document.getElementById('colors');

// Tableau de produits à ajouter au panier
let productsInCart = [];

// Bouton "ajouter au panier"
const buttonAddToCart = document.getElementById('addToCart');

// Insertion des informations dans la page produit
function detailsProduct (element) {
    tabTitle.innerText = element.name;

    let productImage = document.createElement('img');
    productImage.setAttribute('id', 'imageItem');
    productImage.src = element.imageUrl;
    productImage.alt = element.altTxt;

    imgSection.appendChild(productImage);
    
    title.innerHTML = element.name;
    price.innerHTML = element.price;
    description.innerHTML = element.description;

    let firstColorChoice = document.createElement('option');
    firstColorChoice.value = element.colors[0];
    firstColorChoice.innerHTML = element.colors[0];

    let secondColorChoice = document.createElement('option');
    secondColorChoice.value = element.colors[1];
    secondColorChoice.innerHTML = element.colors[1];

    colorChoice.appendChild(firstColorChoice);
    colorChoice.appendChild(secondColorChoice);
}

// Récupération des données d'un produit
function getDatas (URL) {
    fetch(URL)
    .then(function(response) {
        if(response.ok) {
            return response.json();
        }else {
            console.error('Server error')
        }
    })
    .then(function(datas) {
        detailsProduct(datas);
    });
}

//Récupération des données de l'API avec XML HTTP REQUEST
/*function getDatas(URL) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', URL);
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if(httpRequest.readyState == 4) {
            let serverResponse = JSON.parse(httpRequest.responseText);
            detailsProduct(serverResponse);
        }
    }
}*/

// Vérification des produits ajoutés au localStorage
function isIdInCart(datasInStorage, productJson) {
    let isInCart = false;
    for (let i = 0; i < datasInStorage.length; i++) {
        if(productJson.id == datasInStorage[i].id && productJson.color == datasInStorage[i].color) {
            isInCart = true;
        }
    }
    return isInCart;
}

// Ajout d'un nouveau produit dans le localStorage
function addNewProduct(productsArray, newProduct) {
    productsArray.push(newProduct);
    localStorage.setItem('product-ID', JSON.stringify(productsArray ));
    buttonAddToCart.innerHTML = 'Produit ajouté !';
}

// Ajouter un produit au panier
function addToCart() {
    buttonAddToCart.addEventListener('click', function() {
        let productJson = {
            id : productId,
            name : title.innerHTML,
            price : price.innerHTML,
            image : document.getElementById('imageItem').src,
            altText : document.getElementById('imageItem').alt,
            quantity : parseInt(document.getElementById('quantity').value, 10),
            color : document.getElementById('colors').value,
        }

        let datasInStorage = JSON.parse(localStorage.getItem('product-ID'));

        if(!localStorage.getItem('product-ID')) {
            addNewProduct(productsInCart, productJson);

        }else{
            let addQuantity = parseInt(document.getElementById('quantity').value, 10);

            if(isIdInCart(datasInStorage, productJson)) {
                for (let i = 0; i < datasInStorage.length; i++) {
                    if(productJson.id == datasInStorage[i].id && productJson.color == datasInStorage[i].color) {
                        datasInStorage[i].quantity += addQuantity;
                        localStorage.setItem('product-ID', JSON.stringify(datasInStorage));
                        buttonAddToCart.innerHTML = 'Produit ajouté !';
                    }
                }

            }else{
                addNewProduct(datasInStorage, productJson);
            }

        }
    });
}

getDatas(productsURL);
addToCart();