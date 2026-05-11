const API_URL = 'http://localhost:3000';
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];


async function carregarProdutosDoBanco() {
  try {
    const response = await fetch(`${API_URL}/produtos`);
    products = await response.json();
    renderProducts(); 
  } catch (error) {
    console.error("Erro ao conectar com o servidor:", error);
    document.getElementById("product-list").innerHTML = "<p>Ligue o servidor (node server.js)</p>";
  }
}

async function finalizarCompra() {
  if (cart.length === 0) return alert("Carrinho vazio!");

  const pedido = {
    cliente: "Estudante", 
    itens: cart,
    total: document.querySelector('.resumo h3')?.innerText || "R$ 0,00",
    data: new Date()
  };

  try {
    const response = await fetch(`${API_URL}/venda`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });

    const res = await response.json();
    alert(`Pedido #${res.pedidoID} gravado no banco de dados!`);
    
    cart = [];
    localStorage.removeItem("cart");
    saveAndUpdate();
  } catch (error) {
    alert("Erro ao enviar pedido.");
  }
}



function renderProducts(lista = products) {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";
  lista.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p class="price">R$ ${p.price.toFixed(2)}</p>
        <button onclick="addToCart('${p.name}', ${p.price}, '${p.img}')">Comprar</button>
      </div>`;
  });
}

function handleSearch() {
  const input = document.getElementById("search");
  if (input) {
    input.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(term));
      renderProducts(filtered);
    });
  }
}

function addToCart(name, price, img) {
  const item = cart.find(i => i.name === name);
  item ? item.quantity++ : cart.push({ name, price, img, quantity: 1 });
  saveAndUpdate();
}

function saveAndUpdate() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

function renderCart() {
  const container = document.querySelector(".carrinho-itens");
  const resumo = document.querySelector(".resumo");
  if (!container || !resumo) return;

  if (cart.length === 0) {
    container.innerHTML = "<h2>Carrinho Vazio</h2>";
    resumo.innerHTML = "<h3>Total R$ 0,00</h3>";
    return;
  }

  let total = 0;
  container.innerHTML = cart.map((item, idx) => {
    total += item.price * item.quantity;
    return `
      <div class="item">
        <img src="${item.img}">
        <div class="info">
          <h3>${item.name}</h3>
          <p>R$ ${item.price.toFixed(2)}</p>
          <div class="quantidade">
            <button onclick="changeQty(${idx},-1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQty(${idx},1)">+</button>
          </div>
        </div>
      </div>`;
  }).join('');

  resumo.innerHTML = `
    <h2>Resumo</h2>
    <h3>Total R$ ${total.toFixed(2)}</h3>
    <button class="finalizar" onclick="finalizarCompra()">Finalizar e Gravar no Banco</button>
  `;
}

function changeQty(idx, n) {
  cart[idx].quantity += n;
  if (cart[idx].quantity <= 0) cart.splice(idx, 1);
  saveAndUpdate();
}

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutosDoBanco();
  updateCartCount();
  renderCart();
  handleSearch();
});