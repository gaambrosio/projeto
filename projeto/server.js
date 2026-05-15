const express = require('express');
const datastore = require('nedb-promises');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const dbProdutos = datastore.create({ filename: 'banco_dados.db', autoload: true });
const dbUsuarios = datastore.create({ filename: 'usuarios.db', autoload: true });
const dbPedidos = datastore.create({ filename: 'pedidos.db', autoload: true }); // Banco de pedidos

async function initDB() {
    const produtos = await dbProdutos.find({});
    if (produtos.length === 0) {
        await dbProdutos.insert([
            { name: "Sensor Freestyle Libre", price: 299.90, img: "img/sensor-libre.png" },
            { name: "Kit Medidor de Glicose", price: 69.00, img: "img/medidor-glicose.png" },
            { name: "Agulha Uniqmed", price: 39.90, img: "img/agulha-insulina.png" }
        ]);
    }
}
initDB();

// Rota para listar produtos
app.get('/produtos', async (req, res) => {
    const produtos = await dbProdutos.find({});
    res.json(produtos);
});

// Rota para cadastro de usuários
app.post('/cadastrar', async (req, res) => {
    try {
        const usuario = await dbUsuarios.insert(req.body);
        res.json({ status: "Sucesso", usuario });
    } catch (err) {
        res.status(500).json({ status: "Erro", message: err.message });
    }
});

// NOVA ROTA: Finalizar Pedido
app.post('/finalizar-pedido', async (req, res) => {
    try {
        const novoPedido = {
            ...req.body,
            data: new Date(),
            status: "Pendente"
        };
        const pedidoSalvo = await dbPedidos.insert(novoPedido);
        res.json({ status: "Sucesso", pedido: pedidoSalvo });
    } catch (err) {
        console.error("Erro ao salvar pedido:", err);
        res.status(500).json({ status: "Erro", message: "Erro interno ao salvar pedido" });
    }
});

app.listen(3000, () => {
    console.log("🚀 Servidor rodando em http://localhost:3000");
});