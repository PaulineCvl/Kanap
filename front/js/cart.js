// Récupération des données localStorage
let datasInStorage = JSON.parse(localStorage.getItem('product-ID'));
// Récupération des quantités des différents produits du panier
let listOfQuantity = document.getElementsByClassName('itemQuantity');
// Récupération des boutons "supprimer"
let deleteProduct = document.querySelectorAll('.deleteItem');
// Récupération des input du formulaire
let firstName = document.querySelector('#firstName');
let lastName = document.querySelector('#lastName');
let customerAddress = document.querySelector('#address');
let customerCity = document.querySelector('#city');
let customerEmail = document.querySelector('#email');
// Regex de validation des données du formulaire
let validName = /[a-zéèêàçï-\s]+$/i;
let validCustomerAddress = /[0-9]+\s[a-z]+\s[a-zéèêçàï\s\-]+/i;
let validCustomerEmail = /[a-z0-9\.\-\_]+@[a-z]+\.[a-z]{2,3}/i;
// Récupération des balises pour insérer un message d'erreur lors de la validation des données du formulaire
let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
let addressErrorMsg = document.getElementById('addressErrorMsg');
let cityErrorMsg = document.getElementById('cityErrorMsg');
let emailErrorMsg = document.getElementById('emailErrorMsg');
// Récupération du formulaire
let submitForm = document.querySelector('.cart__order__form');
// Récupération du bouton "Commander"
const submitButton = document.querySelector('.cart__order__form__submit input');

// Création d'un ajout d'article dans le panier
function createCart(product) {
    let article = document.createElement('article');
    article.classList.add('cart__item');
    article.dataset.id = product.id;

    let items = document.getElementById('cart__items');
    items.appendChild(article);

    let imageItemContent = document.createElement('div');
    imageItemContent.classList.add('cart__item__img');

    let imageItem = document.createElement('img');
    imageItem.src = product.image;
    imageItem.alt = product.altText;

    imageItemContent.appendChild(imageItem);
    article.appendChild(imageItemContent);

    let content = document.createElement('div');
    content.classList.add('cart__item__content');

    let contentTitlePrice = document.createElement('div');
    contentTitlePrice.classList.add('cart__item__content__titlePrice');

    let settings = document.createElement('div');
    settings.classList.add('cart__item__content__settings');


    content.appendChild(contentTitlePrice);
    content.appendChild(settings);
    article.appendChild(content);

    let titleProduct = document.createElement('h2');
    titleProduct.innerHTML = product.name;
    contentTitlePrice.appendChild(titleProduct);

    let priceProduct = document.createElement('p');
    priceProduct.innerHTML = product.price + ' €';
    contentTitlePrice.appendChild(priceProduct);

    let settingsQuantity = document.createElement('div');
    settingsQuantity.classList.add('cart__item__content__settings__quantity');
    settings.appendChild(settingsQuantity);

    let productQuantity = document.createElement('p');
    productQuantity.innerHTML = 'Qté : ';
    settingsQuantity.appendChild(productQuantity);

    let setProductQuantity = document.createElement('input');
    setProductQuantity.type = 'number';
    setProductQuantity.name = 'itemQuantity';
    setProductQuantity.classList.add('itemQuantity');
    setProductQuantity.min = 1;
    setProductQuantity.max = 100;
    setProductQuantity.value = product.quantity;
    setProductQuantity.dataset.value = parseInt(product.quantity, 10);
    settingsQuantity.appendChild(setProductQuantity);

    let settingsDelete = document.createElement('div');
    settingsDelete.classList.add('cart__item__content__settings__delete');
    settings.appendChild(settingsDelete);

    let deleteItem = document.createElement('p');
    deleteItem.innerHTML = 'Supprimer';
    deleteItem.classList.add('deleteItem');
    settingsDelete.appendChild(deleteItem);
}

// Calcul de la quantité totale de produits et du prix total
function totalQuantityPrices() {
    //Quantité totale
    let totalQuantity = document.getElementById('totalQuantity');
    let sumQuantity = 0;

    for (let i = 0; i < listOfQuantity.length; i++) {
        sumQuantity += parseInt(listOfQuantity[i].value);
    }

    totalQuantity.innerHTML = sumQuantity;

    //Prix total
    let totalPrice = document.getElementById('totalPrice');
    let listOfPrices = document.querySelectorAll('.cart__item__content__titlePrice p');
    let sumPrices = 0;

    for (let i = 0; i < listOfPrices.length; i++) {
        sumPrices += parseInt(listOfPrices[i].innerHTML) * listOfQuantity[i].value;
    }

    totalPrice.innerHTML = sumPrices;
}

// Suppression d'un produit dans le panier
function deleteItem() {
    for (let deleteButton of deleteProduct) {
        deleteButton.addEventListener('click', function () {
            let deleteProductInCart = deleteButton.closest('article');
            deleteProductInCart.remove();

            for (let i = 0; i < datasInStorage.length; i++) {
                if (deleteProductInCart.dataset.id == datasInStorage[i].id) {
                    datasInStorage.splice(i, 1);
                    localStorage.setItem('product-ID', JSON.stringify(datasInStorage));
                }
            }
            totalQuantityPrices();
        });
    }
}

// Vérification des données du formulaire
function checkDatas(data, validData, dataErrorMsg) {
    if (data.value != '') {
        let isValid = true;
        if (!validData.test(data.value)) {
            dataErrorMsg.innerText = 'Non valide';
            isValid = false;
        } else {
            dataErrorMsg.innerText = '';
            isValid = true;
        }
        return isValid;
    }
}

function listenFields(data, validData, dataErrorMsg) {
    data.addEventListener('change', function () {
        checkDatas(data, validData, dataErrorMsg);
        if (validAllFields()) {
            orderRequest();
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    })
}

function validAllFields() {
    let isValidFirstName = checkDatas(firstName, validName, firstNameErrorMsg);
    let isValidLastName = checkDatas(lastName, validName, lastNameErrorMsg);
    let isValidAdress = checkDatas(customerAddress, validCustomerAddress, addressErrorMsg);
    let isValidCity = checkDatas(customerCity, validName, cityErrorMsg);
    let isValidEmail = checkDatas(customerEmail, validCustomerEmail, emailErrorMsg);
    if (isValidFirstName && isValidLastName && isValidAdress && isValidCity && isValidEmail) {
        return true;
    } else {
        return false;
    }
}

// Création des éléments pour envoi des données
function orderRequest() {
    let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: customerAddress.value,
        city: customerCity.value,
        email: customerEmail.value,
    }

    let products = [];
    for (let i = 0; i < datasInStorage.length; i++) {
        products.push(datasInStorage[i].id);
    }

    const order = {
        contact,
        products
    }

    sendOrder(order);
}


function sendOrder(order) {
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            localStorage.setItem('orderId', data.orderId);
        })
}


function submitOrder() {
    submitButton.addEventListener('click', function() {
        let confirmationURL = 'confirmation.html';
        submitForm.action = confirmationURL;
    })
}

function isCart() {

    if (document.getElementById('cartAndFormContainer')) {
        for (let data of datasInStorage) {
            createCart(data);
        }

        totalQuantityPrices();

        // Changement de la quantité depuis le panier
        for (let input of listOfQuantity) {
            input.addEventListener('change', function () {
                totalQuantityPrices();
                input.dataset.value = input.value;

                for (let i = 0; i < datasInStorage.length; i++) {
                    datasInStorage[i].quantity = listOfQuantity[i].dataset.value;
                }
                localStorage.setItem('product-ID', JSON.stringify(datasInStorage));
            });
        }

        deleteItem();
        listenFields(firstName, validName, firstNameErrorMsg);
        listenFields(lastName, validName, lastNameErrorMsg);
        listenFields(customerAddress, validCustomerAddress, addressErrorMsg);
        listenFields(customerCity, validName, cityErrorMsg);
        listenFields(customerEmail, validCustomerEmail, emailErrorMsg);
        submitOrder();

    } else {
        //Affichage du numéro de commande dans la page de confirmation
        const putOrderId = document.getElementById('orderId');

        /*const queryStringUrl = window.location.search
        const urlSearchParams = new URLSearchParams(queryStringUrl);
        const newOrderId = urlSearchParams.get('id');*/

        newOrderId = localStorage.getItem('orderId');
        putOrderId.innerHTML = newOrderId;
        localStorage.clear();
    }
}
isCart();