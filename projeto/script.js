// CONFIGURAÇÃO INICIAL
const API_URL = 'http://localhost:3000';
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// INICIALIZAÇÃO AO CARREGAR A PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();      // Carrega produtos do banco_dados.db
    updateCartCount();    // Atualiza o ícone do carrinho
    renderCart();         // Renderiza itens se estiver na página de carrinho
    setupCadastro();      // Ativa a lógica de cadastro
});

// --- 1. BUSCAR PRODUTOS DO SERVIDOR ---
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/produtos`);
        products = await response.json();
        renderProducts();
    } catch (err) {
        console.error("Erro ao conectar com o servidor. O server.js está ligado?");
        const container = document.getElementById("product-list");
        if (container) container.innerHTML = "<p>Ligue o servidor para ver os produtos.</p>";
    }
}

// --- 2. LOGICA DE CADASTRO (FIXO NA TELA) ---
function setupCadastro() {
    const formCadastro = document.getElementById("form-cadastro");
    const mensagemStatus = document.getElementById("mensagem-status");

    // Verifica se o utilizador já se cadastrou nesta sessão do navegador
    if (localStorage.getItem("cadastroConcluido") === "true" && formCadastro) {
        formCadastro.style.display = "none";
        mensagemStatus.style.display = "block";
    }

    if (formCadastro) {
        formCadastro.addEventListener("submit", async (e) => {
            e.preventDefault();

            const cliente = {
                nome: document.getElementById("nome").value,
                email: document.getElementById("email").value,
                senha: document.getElementById("senha").value
            };

            try {
                const response = await fetch(`${API_URL}/cadastrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cliente)
                });

                const res = await response.json();

                if (res.status === "Sucesso") {
                    // Guarda o estado para não sumir ao dar F5
                    localStorage.setItem("cadastroConcluido", "true");
                    
                    // Troca o formulário pela mensagem de sucesso
                    formCadastro.style.display = "none";
                    mensagemStatus.style.display = "block";
                } else {
                    alert("Erro ao realizar cadastro.");
                }
            } catch (err) {
                alert("Erro ao conectar com o servidor.");
            }
        });
    }
}

// --- 3. GESTÃO DO CARRINHO ---
function renderProducts() {
    const container = document.getElementById("product-list");
    if (!container) return;
    
    container.innerHTML = products.map(p => `
        <div class="product">
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">R$ ${p.price.toFixed(2)}</p>
            <button onclick="addToCart('${p.name}', ${p.price}, '${p.img}')">Comprar</button>
        </div>
    `).join('');
}

function addToCart(name, price, img) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }
    saveCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, i) => sum + i.quantity, 0);
    const el = document.getElementById("cart-count");
    if (el) el.textContent = count;
}

// Renderização específica para a página carrinho.html
function renderCart() {
    const container = document.querySelector(".carrinho-itens");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "<h2>O seu carrinho está vazio</h2>";
        return;
    }

    container.innerHTML = cart.map((item, index) => `
        <div class="item">
            <img src="${item.img}" width="50">
            <div class="info">
                <h3>${item.name}</h3>
                <p>R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                <button onclick="removeItem(${index})">Remover</button>
            </div>
        </div>
    `).join('');
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}