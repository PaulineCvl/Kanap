let datasInStorage = JSON.parse(localStorage.getItem('product'));

// Récupération des données localStorage
function getDatasInStorage () {
    for (let data of datasInStorage) {
        createCart(data);
    }
}
getDatasInStorage();

// Ajout de l'article au panier
function createCart(product) {
    const article = document.createElement('article');
    article.classList.add('cart__item');
    article.dataset.id = product.id;

    const items = document.getElementById('cart__items');
    items.appendChild(article);

    const imageItemContent = document.createElement('div');
    imageItemContent.classList.add('cart__item__img');

    const imageItem = document.createElement('img');
    imageItem.src = product.image;
    imageItem.alt = product.altText;
    
    imageItemContent.appendChild(imageItem);
    article.appendChild(imageItemContent);

    const content = document.createElement('div');
    content.classList.add('cart__item__content');

    const contentTitlePrice = document.createElement('div');
    contentTitlePrice.classList.add('cart__item__content__titlePrice');

    const settings = document.createElement('div');
    settings.classList.add('cart__item__content__settings');

    content.appendChild(contentTitlePrice);
    content.appendChild(settings);
    article.appendChild(content);

    const titleProduct = document.createElement('h2');
    titleProduct.innerHTML = product.name;
    contentTitlePrice.appendChild(titleProduct);

    const priceProduct = document.createElement('p');
    priceProduct.innerHTML = product.price + ' €';
    contentTitlePrice.appendChild(priceProduct);

    const settingsQuantity = document.createElement('div');
    settingsQuantity.classList.add('cart__item__content__settings__quantity');
    settings.appendChild(settingsQuantity);

    const productQuantity = document.createElement('p');
    productQuantity.innerHTML = 'Qté : ';
    settingsQuantity.appendChild(productQuantity);

    const setProductQuantity = document.createElement('input');
    setProductQuantity.type = 'number';
    setProductQuantity.name = 'itemQuantity';
    setProductQuantity.classList.add('itemQuantity');
    setProductQuantity.min = 1;
    setProductQuantity.max = 100;
    setProductQuantity.value = product.quantity;
    setProductQuantity.dataset.value = parseInt(product.quantity, 10);
    settingsQuantity.appendChild(setProductQuantity);

    const settingsDelete = document.createElement('div');
    settingsDelete.classList.add('cart__item__content__settings__delete');
    settings.appendChild(settingsDelete);

    const deleteItem = document.createElement('p');
    deleteItem.innerHTML = 'Supprimer';
    deleteItem.classList.add('deleteItem');
    settingsDelete.appendChild(deleteItem);
}

function totalQuantityPrices() {
    //Calcul de la quantité totale de produits
    let listOfQuantity = document.getElementsByClassName('itemQuantity');
    let arrayQuantity = [];

    for (let product of listOfQuantity) {
        arrayQuantity.push(parseInt(product.value, 10));
    }

    let sumQuantity = 0;
    for (let i = 0; i < arrayQuantity.length; i++) {
        sumQuantity += arrayQuantity[i];
    }
    const totalQuantity = document.getElementById('totalQuantity');
    totalQuantity.innerHTML = sumQuantity;


    //Calcul du prix total
    let listOfPrices = document.querySelectorAll('.cart__item__content__titlePrice p');
    let arrayPrices = [];
    for (let price of listOfPrices) {
        arrayPrices.push(parseInt(price.innerHTML));
    }
    let sumPrices = 0;
    for (let i = 0; i < arrayPrices.length; i++) {
        sumPrices += arrayPrices[i] * arrayQuantity[i];
    }
    const totalPrice = document.getElementById('totalPrice');
    totalPrice.innerHTML = sumPrices;

    console.log(arrayQuantity);
}
totalQuantityPrices();

// Changement de la quantité depuis le panier
let inputQuantity = document.querySelectorAll('input.itemQuantity');
for (let input of inputQuantity) {
    input.addEventListener('change', function() {
        totalQuantityPrices();
        input.dataset.value = input.value;

        for (let i = 0; i < datasInStorage.length; i++) {
            datasInStorage[i].quantity = inputQuantity[i].dataset.value;
        }
        localStorage.setItem('product', JSON.stringify(datasInStorage));
    });
}

// Suppression d'un produit dans le panier
let deleteProduct = document.querySelectorAll('.deleteItem');
for (let deleteButton of deleteProduct) {
    deleteButton.addEventListener('click', function() {
        let deleteProductInCart = deleteButton.closest('article');
        deleteProductInCart.remove();

        for (let i = 0; i < datasInStorage.length; i++) {
                if(deleteProductInCart.dataset.id == datasInStorage[i].id) {
                    datasInStorage.splice(i, 1);
                    localStorage.setItem('product', JSON.stringify(datasInStorage));
                }
        }

        totalQuantityPrices();

    });

}



