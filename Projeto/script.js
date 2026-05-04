const products = [
  {
    name: "Sensor Freestyle Libre",
    price: 299.90,
    image: "img/sensor-libre.png" 
  },
  {
    name: "Kit Medidor de Glicose - Accu-Chek",
    price: 69.00,
    image: "img/medidor-glicose.png"
  },
  {
    name: "Agulha para Insulina - Uniqmed 6mm",
    price: 39.90,
    image: "img/agulha-insulina.png"
  },
  {
    name: "Tiras Glicemia - On Call Plus II",
    price: 49.90,
    image: "img/tiras-glicose.png"
  }
];

let cart = 0;

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");

function renderProducts() {
  products.forEach(product => {
    const div = document.createElement("div");
    div.classList.add("product");

    div.innerHTML = `
      <img src="${product.image}">
      <h3>${product.name}</h3>
      <p class="price">R$ ${product.price.toFixed(2)}</p>
      <button onclick="addToCart()">Comprar</button>
    `;

    productList.appendChild(div);
  });
}

function addToCart() {
  cart++;
  cartCount.innerText = cart;
}

function addToCart() {
  cart++;
  cartCount.innerText = cart;

  const btn = document.querySelector(".cart-btn");
  btn.classList.add("animate");

  setTimeout(() => {
    btn.classList.remove("animate");
  }, 300);
}

renderProducts();