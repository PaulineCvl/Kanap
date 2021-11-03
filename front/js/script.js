let productsURL = 'http://localhost:3000/api/products';

// Création d'une fiche produit
function createProduct (element) {
    const card = document.createElement('a');
    card.href = 'product.html?id=' + element._id;

    const article = document.createElement('article');

    const newProductImage = document.createElement('img');
    newProductImage.src = element.imageUrl;
    newProductImage.alt = element.altTxt;

    const newProductName = document.createElement('h3');
    newProductName.innerHTML = element.name;
    newProductName.classList.add('productName');

    const newProductDescription = document.createElement('p');
    newProductDescription.innerHTML = element.description;
    newProductDescription.classList.add('productDescription');

    article.appendChild(newProductImage);
    article.appendChild(newProductName);
    article.appendChild(newProductDescription);
    card.appendChild(article);
    document.getElementById('items').appendChild(card);
}

// Récupération des données de l'API
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
        for (let data of datas) {
            createProduct(data);
        }
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
            for (let data of serverResponse) {
                createProduct(data);
            }
        }
    }
}*/

getDatas(productsURL);