const express = require('express');
const datastore = require('nedb-promises');
const cors = require('cors');

const app = express();
const db = datastore.create('banco_dados.db'); 

app.use(cors());
app.use(express.json());
app.use(express.static('.')); 


app.get('/produtos', async (req, res) => {
    const produtos = await db.find({});
    res.json(produtos);
});


app.post('/produtos', async (req, res) => {
    const novo = req.body;
    await db.insert(novo);
    res.status(201).json({ mensagem: "Produto salvo no banco!" });
});


app.post('/venda', (req, res) => {
    console.log("Venda registrada no servidor:", req.body);
    res.json({ status: "Sucesso", pedidoID: Math.floor(Math.random() * 1000) });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));