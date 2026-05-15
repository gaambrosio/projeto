const API_URL = 'http://localhost:3000';

function renderCart() {

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const totalItens = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    const contador = document.getElementById('cart-count');

    if (contador) {
        contador.textContent = totalItens;
    }
}

function adicionarAoCarrinho(produto) {

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const itemExistente = cart.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantity += 1;
    } else {
        cart.push({
            ...produto,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    atualizarContadorCarrinho();

    alert('Produto adicionado ao carrinho!');
}

window.addEventListener('DOMContentLoaded', atualizarContadorCarrinho);