// Récupération de l'url de la page produit

const queryStringUrl = window.location.search;

// Extraction de l'id

const urlSearchParams = new URLSearchParams(queryStringUrl);
const productId = urlSearchParams.get('id');

// Insertion des informations dans la page produit

function detailsProduct (element) {
    const productImage = document.createElement('img');
    productImage.src = element.imageUrl;

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
        addToCart(datas);
    });
}

getDatas();


// Ajouter un produit au panier

function addToCart (element) {
    const buttonAddToCart = document.getElementById('addToCart');
    buttonAddToCart.addEventListener('click', function() {
        let productJson = {
            id : element._id,
            name : element.name,
            price : element.price,
            image : element.imageUrl,
            altText : element.altTxt,
            quantity : parseInt(document.getElementById('quantity').value, 10),
            color : document.getElementById('colors').value,
        }

        function compareId(id) {
            let productInCart = localStorage.getItem('product');
            let productInCartJson = JSON.parse(productInCart);
            for (let i of productInCartJson) {
                if(i.id == id && i.color == productJson.color) {
                    return true;
                    /*i.quantity = i.quantity + productJson.quantity;
                    localStorage.setItem('product', JSON.stringify(productInCartJson));*/
                    
                }else{
                    return false;
                    /*
                    productInCartJson.push(productJson);
                    localStorage.setItem('product', JSON.stringify(productInCartJson));
                    buttonAddToCart.innerHTML = 'Produit ajouté !';*/
                }
            }
        }

        if(!localStorage.getItem('product')) {
            let productInCart = [];
            productInCart.push(productJson);
            localStorage.setItem('product', JSON.stringify(productInCart));
            buttonAddToCart.innerHTML = 'Produit ajouté !';
        }else if(localStorage.getItem('product') && compareId(productId) == true){
            console.log('true');
            let productInCart = localStorage.getItem('product');
            let productInCartJson = JSON.parse(productInCart);
            for (let i of productInCartJson) {
                i.quantity = i.quantity + productJson.quantity;
                localStorage.setItem('product', JSON.stringify(productInCartJson));
            }
            
        }else{
            let productInCart = localStorage.getItem('product');
            let productInCartJson = JSON.parse(productInCart);
            productInCartJson.push(productJson);
            localStorage.setItem('product', JSON.stringify(productInCartJson));
            buttonAddToCart.innerHTML = 'Produit ajouté !';
        }
   
    });
}

