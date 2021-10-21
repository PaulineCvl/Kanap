if(document.getElementById('cartAndFormContainer')) {    

let datasInStorage = JSON.parse(localStorage.getItem('product-ID'));

    // Récupération des données localStorage
    for (let data of datasInStorage) {
        createCart(data);
    }

    // Ajout de l'article au panier
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

    let listOfQuantity = document.getElementsByClassName('itemQuantity');

    function totalQuantityPrices() {
        //Calcul de la quantité totale de produits
        let totalQuantity = document.getElementById('totalQuantity');
        let sumQuantity = 0;

        for (let i = 0; i < listOfQuantity.length; i++) {
            sumQuantity += parseInt(listOfQuantity[i].value);
        }

        totalQuantity.innerHTML = sumQuantity;

        //Calcul du prix total
        let totalPrice = document.getElementById('totalPrice');
        let listOfPrices = document.querySelectorAll('.cart__item__content__titlePrice p');
        let sumPrices = 0;

        for (let i = 0; i < listOfPrices.length; i++) {
            sumPrices += parseInt(listOfPrices[i].innerHTML) * listOfQuantity[i].value;
        }

        totalPrice.innerHTML = sumPrices;

    }
    totalQuantityPrices();

    // Changement de la quantité depuis le panier
    for (let input of listOfQuantity) {
        input.addEventListener('change', function() {
            totalQuantityPrices();
            input.dataset.value = input.value;

            for (let i = 0; i < datasInStorage.length; i++) {
                datasInStorage[i].quantity = listOfQuantity[i].dataset.value;
            }
            localStorage.setItem('product-ID', JSON.stringify(datasInStorage));
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
                    localStorage.setItem('product-ID', JSON.stringify(datasInStorage));
                }
            }
            totalQuantityPrices();
        });
    }

    // Vérification des données du formulaire
    function datasCheck (validData, data, dataErrorMsg){
        data.addEventListener('change', function() {
            if(!validData.test(data.value)) {
                dataErrorMsg.innerHTML = data + 'non valide';
            }else{
                dataErrorMsg.innerHTML = '';
            }
        })
    }

    //Prénom
    let firstName = document.getElementById('firstName');
    let validFirstName = /([^0-9][a-zéèêàçï\s\-])+/gi;
    let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
    
    datasCheck(validFirstName, firstName, firstNameErrorMsg);

    //Nom
    let lastName = document.getElementById('lastName');
    let validLastName = /([^0-9][a-zéèêàçï\s\-])+/gi;
    let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
    
    datasCheck(validLastName, lastName, lastNameErrorMsg);

    //Adresse
    let customerAddress = document.getElementById('address');
    let validCustomerAddress = /[0-9]+\s[a-z]+\s[a-zéèêçàï\s\-]+/gi;
    let addressErrorMsg = document.getElementById('addressErrorMsg');

    datasCheck(validCustomerAddress, customerAddress, addressErrorMsg);

    //Ville
    let customerCity = document.getElementById('city');
    let validCustomerCity = /([^0-9][a-zéèêàçï\s\-])+/gi;
    let cityErrorMsg = document.getElementById('cityErrorMsg');

    datasCheck(validCustomerCity, customerCity, cityErrorMsg);

    //E-mail
    let customerEmail = document.getElementById('email');
    let validCustomerEmail = /[a-z0-9\.\-\_]+@[a-z]+\.[a-z]{2,3}/gi;
    let emailErrorMsg = document.getElementById('emailErrorMsg');
    
    datasCheck(validCustomerEmail, customerEmail, emailErrorMsg);
    

    //Création d'un objet "contact"
    let formInput = document.querySelectorAll('.cart__order__form__question input');

    for (let input of formInput) {
        input.addEventListener('change', function() {
            let contact = {
                firstName : firstName.value,
                lastName : lastName.value,
                address : customerAddress.value,
                city : customerCity.value,
                email : customerEmail.value,
            }
            localStorage.setItem('contact', JSON.stringify(contact));
            orderElements();
        })
    }

    function orderElements (){
        let contact = JSON.parse(localStorage.getItem('contact'));

        //Création d'un tableau "products"
        let products = [];
        for (let i = 0; i < datasInStorage.length; i++) {
            products.push(datasInStorage[i].id);
        }

        //Envoi des données vers l'API
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
        .then(function(response) {
            if(response.ok){
                return response.json();
            }
        })
        .then(function(data){
            validateOrder(data.orderId);
            console.log(data.orderId);
        })
    }

    //Redirection du bouton de commande vers la page de validation
    const submitForm = document.querySelector('.cart__order__form');
    submitForm.method = 'post';
    function validateOrder(confirmOrder) {
        submitForm.action = 'confirmation.html?id=' + confirmOrder;
    }
}else{
    //Affichage du numéro de commande dans la page de confirmation
    const putOrderId = document.getElementById('orderId');

    const queryStringUrl = window.location.search
    const urlSearchParams = new URLSearchParams(queryStringUrl);
    const newOrderId = urlSearchParams.get('id');

    putOrderId.innerHTML = newOrderId;
    localStorage.clear();
}