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

function getDatas () {
    fetch('http://localhost:3000/api/products')
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

getDatas();

