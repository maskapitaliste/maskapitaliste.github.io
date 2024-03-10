/*
** EPITECH PROJECT, 2023
** kedufron-t-maskapitaliste
** File description:
** script.js
*/

let cart = [];

async function fetchItemImage(itemId) {
    try {
        const response = await fetch(`https://api.kedufront.juniortaker.com/item/picture/${itemId}`);
        if (!response.ok) {
            throw new Error('La récupération de l\'image a échoué.');
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération de l\'image:', error);
        return null;
    }
}

async function fetchAndDisplayItems() {
    try {
        const response = await fetch('https://api.kedufront.juniortaker.com/item/');
        const items = await response.json();
        const container = document.getElementById('items-container');
        if (items.length === 0) {
            container.innerHTML = '<p>Aucun item n\'a été trouvé.</p>';
            return;
        }

        for (const item of items) {
            const imageSrc = await fetchItemImage(item._id);
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('item');
            const itemHTML = `
                <img src="${imageSrc}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Description: ${item.description}</p>
                <p>Prix: ${item.price}€</p>
                <p>Date de création: ${item.createdIn}</p>
                <button class="add-to-cart-btn" data-item-id="${item._id}" data-item-name="${item.name}" data-item-price="${item.price}">Ajouter au panier</button>
            `;
            itemContainer.innerHTML = itemHTML;
            container.appendChild(itemContainer);
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des items :', error);
    }
}

function addToCart(item) {
    cart.push(item);
    updateCartDisplay();
    saveCartToLocalStorage();
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItemContainer = document.createElement('div');
        cartItemContainer.classList.add('cart-item');
        const cartItemHTML = `
            <h3>${item.name}</h3>
            <p>Prix: ${item.price}€</p>
        `;
        cartItemContainer.innerHTML = cartItemHTML;
        cartContainer.appendChild(cartItemContainer);
    });
}

document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('add-to-cart-btn')) {
        const itemId = event.target.dataset.itemId;
        const itemName = event.target.dataset.itemName;
        const itemPrice = event.target.dataset.itemPrice;
        const selectedItem = {
            _id: itemId,
            name: itemName,
            price: itemPrice
        };
        addToCart(selectedItem);
    }
});

function getCartFromLocalStorage() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function displayCartItems() {
    const cart = getCartFromLocalStorage();
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Votre panier est vide.</p>';
        return;
    }
    const itemCounts = {};
    cart.forEach(item => {
        const itemId = item._id;
        if (!itemCounts[itemId]) {
            itemCounts[itemId] = 1;
        } else {
            itemCounts[itemId]++;
        }
    });
    for (const itemId in itemCounts) {
        const itemCount = itemCounts[itemId];
        const item = cart.find(item => item._id === itemId);
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('cart-item');
        const itemHTML = `
            <h3>${item.name}</h3>
            <p>Prix: ${item.price}€</p>
            <p>Quantité: ${itemCount}</p>
        `;
        itemContainer.innerHTML = itemHTML;
        cartContainer.appendChild(itemContainer);
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayItems);
document.addEventListener('DOMContentLoaded', displayCartItems);

// Initialiser le panier à partir du stockage local lors du chargement de la page
cart = getCartFromLocalStorage();
updateCartDisplay();
