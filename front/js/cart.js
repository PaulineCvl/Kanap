// Récupération des données localStorage
const dataName = localStorage.getItem('name');
const dataPrice = localStorage.getItem('price');
const dataImage = localStorage.getItem('image');
const dataAltText = localStorage.getItem('altText');
const dataQuantity = localStorage.getItem('quantity');

// Ajout de l'article au panier
function productCart() {
    const article = document.createElement('article');
    article.classList.add('cart__item');

    const items = document.getElementById('cart__items');
    items.appendChild(article);

    const imageItemContent = document.createElement('div');
    imageItemContent.classList.add('cart__item__img');

    const imageItem = document.createElement('img');
    imageItem.src = dataImage;
    imageItem.alt = dataAltText;
    
    imageItemContent.appendChild(imageItem);
    article.appendChild(imageItemContent);

    const content = document.createElement('div');
    content.classList.add('cart__item__content');
    article.appendChild(content);

    const contentTitlePrice = document.createElement('div');
    content.classList.add('cart__item__content__titlePrice');
    content.appendChild(contentTitlePrice);

    const titleProduct = document.createElement('h2');
    titleProduct.innerHTML = dataName;
    contentTitlePrice.appendChild(titleProduct);

    const priceProduct = document.createElement('p');
    priceProduct.innerHTML = dataPrice + ' €';
    contentTitlePrice.appendChild(priceProduct);

    const settings = document.createElement('div');
    settings.classList.add('cart__item__content__settings');
    content.appendChild(settings);

    const settingsQuantity = document.createElement('div');
    settingsQuantity.classList.add('cart__item__content__settings__quantity');
    settings.appendChild(settingsQuantity);

    const productQuantity = document.createElement('p');
    productQuantity.innerHTML = 'Qté : ' + dataQuantity;
    settingsQuantity.appendChild(productQuantity);
}

productCart();