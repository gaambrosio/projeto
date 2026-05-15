const API_URL = 'http://localhost:3000';

document.addEventListener("DOMContentLoaded", () => {
    // Funções de inicialização
    updateCartCount();
    exibirNomeUsuario();
    
    // Carrega produtos apenas se o container existir (na Home)
    const productContainer = document.getElementById("product-list");
    if (productContainer) {
        fetchProducts();
    }
    
    // Ativa a lógica do formulário de cadastro
    setupCadastro();
});

// BUSCAR PRODUTOS DO SERVIDOR
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/produtos`);
        const products = await response.json();
        const container = document.getElementById("product-list");
        
        if (!container) return;

        container.innerHTML = products.map(p => `
            <div class="product">
                <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${p.name}</h3>
                <p class="price" style="color: #5393FF; font-weight: bold; font-size: 1.2em; margin: 10px 0;">
                    R$ ${p.price.toFixed(2).replace('.', ',')}
                </p>
                <button class="nav-btn primary" style="width: 100%" onclick="addToCart('${p.name}', ${p.price}, '${p.img}')">
                    Adicionar ao Carrinho
                </button>
            </div>
        `).join('');
    } catch (err) {
        console.error("Erro ao carregar produtos:", err);
    }
}

// LÓGICA DE CADASTRO UNIFICADA
function setupCadastro() {
    const form = document.getElementById("form-cadastro");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {
            const res = await fetch(`${API_URL}/cadastrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });

            if (res.ok) {
                localStorage.setItem("usuarioLogado", "true");
                localStorage.setItem("nomeUsuario", nome);
                
                form.style.display = "none";
                const msgSucesso = document.getElementById("mensagem-status");
                if (msgSucesso) msgSucesso.style.display = "block";

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            }
        } catch (err) {
            console.error("Erro no cadastro:", err);
            alert("Erro ao conectar com o servidor.");
        }
    });
}

// LÓGICA DO CARRINHO (ADICIONAR)
function addToCart(name, price, img) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(item => item.name === name);
    
    if (index > -1) {
        cart[index].quantity++;
    } else {
        cart.push({ name, price: Number(price), img, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${name} adicionado com sucesso!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const countElement = document.getElementById("cart-count");
    if (countElement) {
        countElement.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }
}

// LÓGICA DE FINALIZAR COMPRA (NOVA)
async function finalizarCompra() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const nomeUsuario = localStorage.getItem("nomeUsuario");

    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (!nomeUsuario) {
        alert("Por favor, faça seu cadastro para finalizar a compra.");
        window.location.href = "cadastro.html";
        return;
    }

    const dadosPedido = {
        cliente: nomeUsuario,
        itens: cart,
        total: cart.reduce((t, i) => t + (i.price * i.quantity), 0),
        data: new Date().toLocaleString()
    };

    try {
        const response = await fetch(`${API_URL}/finalizar-pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosPedido)
        });

        if (response.ok) {
            alert("Compra realizada com sucesso!");
            localStorage.removeItem("cart"); // Limpa o carrinho
            window.location.href = "index.html";
        } else {
            alert("O servidor encontrou um erro ao processar o pedido.");
        }
    } catch (err) {
        alert("Erro ao conectar com o servidor. Verifique se o Node.js está rodando.");
    }
}

function exibirNomeUsuario() {
    const nome = localStorage.getItem("nomeUsuario");
    const container = document.querySelector(".header-right");
    
    if (nome && container && !document.getElementById("user-greeting")) {
        const greeting = document.createElement("span");
        greeting.id = "user-greeting";
        greeting.style.cssText = "color: #5393FF; margin-right: 15px; font-weight: bold;";
        greeting.textContent = `Olá, ${nome.split(' ')[0]}`;
        container.prepend(greeting);
    }
}