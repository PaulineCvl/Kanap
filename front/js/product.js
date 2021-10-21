// Récupération de l'url de la page produit

const queryStringUrl = window.location.search;

// Extraction de l'id

const urlSearchParams = new URLSearchParams(queryStringUrl);
const productId = urlSearchParams.get('id');

// Insertion des informations dans la page produit
const tabTitle = document.querySelector('title');
const imgSection = document.querySelector('.item__img')
const title = document.getElementById('title');
const price = document.getElementById('price');
const description = document.getElementById('description');
const colorChoice = document.getElementById('colors');

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

function getDatas () {
    fetch('http://localhost:3000/api/products/'+ productId)
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
getDatas();

// Ajouter un produit au panier
let productsInCart = [];

const buttonAddToCart = document.getElementById('addToCart');
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
        productsInCart.push(productJson);
        localStorage.setItem('product-ID', JSON.stringify(productsInCart));
        buttonAddToCart.innerHTML = 'Produit ajouté !';

    }else{
        let addQuantity = parseInt(document.getElementById('quantity').value, 10);
        function isIdInCart () {
            for (let i = 0; i < datasInStorage.length; i++) {
                if(productJson.id == datasInStorage[i].id && productJson.color == datasInStorage[i].color) {
                    datasInStorage[i].quantity += addQuantity;
                    localStorage.setItem('product-ID', JSON.stringify(datasInStorage));
                    buttonAddToCart.innerHTML = 'Produit ajouté !';
                    return true;
                }
            }
        }
        if(isIdInCart() == true) {
            for (let i = 0; i < datasInStorage.length; i++) {
                if(productJson.id == datasInStorage[i].id && productJson.color == datasInStorage[i].color) {
                    datasInStorage[i].quantity += addQuantity;
                    localStorage.setItem('product-ID', JSON.stringify(datasInStorage));
                    buttonAddToCart.innerHTML = 'Produit ajouté !';
                }
            }

        }else{
            datasInStorage.push(productJson);
            localStorage.setItem('product-ID', JSON.stringify(datasInStorage));
            buttonAddToCart.innerHTML = 'Produit ajouté !';
        }

    }
});


