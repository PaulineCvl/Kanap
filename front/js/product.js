let productsInCart = [];

// Récupération de l'url de la page produit

const queryStringUrl = window.location.search;

// Extraction de l'id

const urlSearchParams = new URLSearchParams(queryStringUrl);
const productId = urlSearchParams.get('id');

// Insertion des informations dans la page produit

function detailsProduct (element) {
    const productImage = document.createElement('img');
    productImage.src = element.imageUrl;
    productImage.alt = element.altTxt;

    const imgSection = document.querySelector('.item__img')
    imgSection.appendChild(productImage);
    
    const title = document.getElementById('title');
    title.innerHTML = element.name;

    const price = document.getElementById('price');
    price.innerHTML = element.price;

    const description = document.getElementById('description');
    description.innerHTML = element.description;

    const firstColorChoice = document.createElement('option');
    firstColorChoice.value = element.colors[0];
    firstColorChoice.innerHTML = element.colors[0];

    const secondColorChoice = document.createElement('option');
    secondColorChoice.value = element.colors[1];
    secondColorChoice.innerHTML = element.colors[1];

    const colorChoice = document.getElementById('colors');
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

// Comparaison de l'identifiant et de la couleur du produit ajouté avec ceux des produits du local storage
function compareId(id, color) {
    let arrayInCart = JSON.parse(localStorage.getItem('product'));
    for (let product of arrayInCart) {
        if(product.id == id && product.color == color) {
            return true;
        }else{
            return false;
        }
    }
            
}

// Ajouter un produit au panier
const buttonAddToCart = document.getElementById('addToCart');
buttonAddToCart.addEventListener('click', function() {
    let productJson = {
        id : productId,
        name : title.innerHTML,
        price : price.innerHTML,
        //image : productImage.src,
        //altText : productImage.alt,
        quantity : parseInt(document.getElementById('quantity').value, 10),
        color : document.getElementById('colors').value,
    }
    console.log(productJson.id);

    if(!localStorage.getItem('product')) {
        productsInCart.push(productJson);
        localStorage.setItem('product', JSON.stringify(productsInCart));
        buttonAddToCart.innerHTML = 'Produit ajouté !';

    }else if(localStorage.getItem('product') && compareId(productJson.id, productJson.color)) {
        let productInCart = localStorage.getItem('product');
        let productInCartJson = JSON.parse(productInCart);
        for (let i of productInCartJson) {
            i.quantity = i.quantity + productJson.quantity;
            localStorage.setItem('product', JSON.stringify(productInCartJson));
        }

    }else{
        let arrayInCart = localStorage.getItem('product');
        let arrayInCartJson = JSON.parse(arrayInCart);
        arrayInCartJson.push(productJson);
        localStorage.setItem('product', JSON.stringify(arrayInCartJson));
        buttonAddToCart.innerHTML = 'Produit ajouté !';
    }
   
});


