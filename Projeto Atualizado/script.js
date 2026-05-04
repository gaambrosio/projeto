
const products = [
  {
    name: "Sensor Freestyle Libre",
    price: 299.90,
    img: "img/sensor-libre.png"
  },
  {
    name: "Kit Medidor de Glicose - Accu-Chek",
    price: 69.00,
    img: "img/medidor-glicose.png"
  },
  {
    name: "Agulha para Insulina - Uniqmed 6mm",
    price: 39.90,
    img: "img/agulha-insulina.png"
  },
  {
    name: "Tiras Glicemia - On Call Plus II",
    price: 49.90,
    img: "img/tiras-glicose.png"
  }
];



let cart = JSON.parse(localStorage.getItem("cart")) || [];



function addToCart(name, price, img) {

  const product = cart.find(item => item.name === name);

  if (product) {
    product.quantity++;
  } else {
    cart.push({
      name,
      price,
      img,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();


  const btn = document.querySelector(".cart-btn");

  if (btn) {
    btn.classList.add("animate");

    setTimeout(() => {
      btn.classList.remove("animate");
    }, 300);
  }
}




function updateCartCount() {

  const total = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const counter = document.getElementById("cart-count");

  if (counter) {
    counter.textContent = total;
  }
}



function renderProducts() {

  const container =
    document.getElementById("product-list");

  if (!container) return;

  container.innerHTML = "";

  products.forEach(product => {

    container.innerHTML += `
    
      <div class="product">

        <img src="${product.img}">

        <h3>${product.name}</h3>

        <p class="price">
          R$ ${product.price.toFixed(2)}
        </p>

        <button onclick="
          addToCart(
            '${product.name}',
            ${product.price},
            '${product.img}'
          )
        ">
          Comprar
        </button>

      </div>

    `;
  });
}



function renderCart() {

  const container =
    document.querySelector(".carrinho-itens");

  const resumo =
    document.querySelector(".resumo");

  if (!container || !resumo) return;


  if (cart.length === 0) {

    container.innerHTML =
      "<h2>Seu carrinho está vazio 🛒</h2>";

    resumo.innerHTML = `
      <h2>Resumo</h2>
      <p>Subtotal <span>R$ 0,00</span></p>
      <p>Frete <span>R$ 0,00</span></p>
      <h3>Total R$ 0,00</h3>
    `;

    return;
  }


  container.innerHTML = "";

  let total = 0;


  cart.forEach((item, index) => {

    total += item.price * item.quantity;


    container.innerHTML += `
    
      <div class="item">

        <img src="${item.img}">

        <div class="info">

          <h3>${item.name}</h3>

          <p>
            R$ ${item.price.toFixed(2)}
          </p>

          <div class="quantidade">

            <button
              onclick="changeQuantity(${index},-1)">
              -
            </button>

            <span>${item.quantity}</span>

            <button
              onclick="changeQuantity(${index},1)">
              +
            </button>

          </div>

          <button
            onclick="removeItem(${index})">
            Remover
          </button>

        </div>

      </div>

    `;
  });


  const frete = total > 200 ? 0 : 20;


  resumo.innerHTML = `
  
    <h2>Resumo</h2>

    <p>
      Subtotal
      <span>R$ ${total.toFixed(2)}</span>
    </p>

    <p>
      Frete
      <span>R$ ${frete.toFixed(2)}</span>
    </p>

    <h3>
      Total R$ ${(total + frete).toFixed(2)}
    </h3>

    <button class="finalizar">
      Finalizar Compra
    </button>

  `;
}

function changeQuantity(index, change) {

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  renderCart();
  updateCartCount();
}



function removeItem(index) {

  cart.splice(index, 1);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  renderCart();
  updateCartCount();
}



document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateCartCount();

    renderProducts();

    renderCart();

  }
);