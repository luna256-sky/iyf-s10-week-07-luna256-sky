// -----------------------------------
// CENTRALIZED STATE
// -----------------------------------

const state = {

    products: [

        {
            id: 1,
            name: "Laptop",
            price: 999,
            image: "https://via.placeholder.com/200"
        },

        {
            id: 2,
            name: "Phone",
            price: 699,
            image: "https://via.placeholder.com/200"
        },

        {
            id: 3,
            name: "Headphones",
            price: 199,
            image: "https://via.placeholder.com/200"
        }

    ],

    cart: []

};

// -----------------------------------
// LOAD CART FROM STORAGE
// -----------------------------------

function loadCart() {

    const saved =
        localStorage.getItem("cart");

    if (saved) {

        state.cart = JSON.parse(saved);

    }

}

// -----------------------------------
// SAVE CART
// -----------------------------------

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(state.cart)
    );

}

// -----------------------------------
// ADD TO CART
// -----------------------------------

function addToCart(productId) {

    const existing =
        state.cart.find(
            item => item.productId === productId
        );

    if (existing) {

        existing.quantity++;

    } else {

        state.cart.push({

            productId,

            quantity: 1

        });

    }

    saveCart();

    renderCart();

}

// -----------------------------------
// UPDATE QUANTITY
// -----------------------------------

function updateQuantity(productId, quantity) {

    const item =
        state.cart.find(
            item => item.productId === productId
        );

    if (!item) return;

    if (quantity <= 0) {

        removeFromCart(productId);

    } else {

        item.quantity = quantity;

    }

    saveCart();

    renderCart();

}

// -----------------------------------
// REMOVE FROM CART
// -----------------------------------

function removeFromCart(productId) {

    state.cart =
        state.cart.filter(
            item => item.productId !== productId
        );

    saveCart();

    renderCart();

}

// -----------------------------------
// GET TOTAL
// -----------------------------------

function getCartTotal() {

    return state.cart.reduce(

        (total, item) => {

            const product =
                state.products.find(
                    p => p.id === item.productId
                );

            return total +
                (product.price * item.quantity);

        },

        0
    );

}

// -----------------------------------
// GET CART COUNT
// -----------------------------------

function getCartCount() {

    return state.cart.reduce(

        (count, item) =>

            count + item.quantity,

        0
    );

}

// -----------------------------------
// CLEAR CART
// -----------------------------------

function clearCart() {

    state.cart = [];

    saveCart();

    renderCart();

}

// -----------------------------------
// RENDER PRODUCTS
// -----------------------------------

function renderProducts() {

    const productsContainer =
        document.getElementById("products");

    productsContainer.innerHTML = "";

    state.products.forEach(product => {

        const card =
            document.createElement("div");

        card.classList.add("product-card");

        card.innerHTML = `

            <img src="${product.image}" />

            <h3>${product.name}</h3>

            <p>$${product.price}</p>

            <button
                onclick="addToCart(${product.id})"
            >
                Add to Cart
            </button>

        `;

        productsContainer.appendChild(card);

    });

}

// -----------------------------------
// RENDER CART
// -----------------------------------

function renderCart() {

    const cartContainer =
        document.getElementById("cart-items");

    cartContainer.innerHTML = "";

    state.cart.forEach(item => {

        const product =
            state.products.find(
                p => p.id === item.productId
            );

        const div =
            document.createElement("div");

        div.classList.add("cart-item");

        div.innerHTML = `

            <h4>${product.name}</h4>

            <p>
                $${product.price}
                x
                ${item.quantity}
            </p>

            <div>

                <button
                    onclick="
                        updateQuantity(
                            ${item.productId},
                            ${item.quantity + 1}
                        )
                    "
                >
                    +
                </button>

                <button
                    onclick="
                        updateQuantity(
                            ${item.productId},
                            ${item.quantity - 1}
                        )
                    "
                >
                    -
                </button>

                <button
                    onclick="
                        removeFromCart(
                            ${item.productId}
                        )
                    "
                >
                    Remove
                </button>

            </div>

        `;

        cartContainer.appendChild(div);

    });

    // UPDATE TOTAL

    document.getElementById(
        "cart-total"
    ).textContent =
        getCartTotal();

    // UPDATE COUNT

    document.getElementById(
        "cart-count"
    ).textContent =
        getCartCount();

}

// -----------------------------------
// INITIALIZE APP
// -----------------------------------

loadCart();

renderProducts();

renderCart();

// -----------------------------------
// CLEAR CART BUTTON
// -----------------------------------

document.getElementById(
    "clear-cart"
).addEventListener(
    "click",
    clearCart
);