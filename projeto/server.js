const express = require('express');
const datastore = require('nedb-promises');
const cors = require('cors');

const app = express();
const db = datastore.create('banco_dados.db'); 
const dbClientes = datastore.create('clientes.db');

app.use(cors());
app.use(express.json());
app.use(express.static('.')); 

app.get('/produtos', async (req, res) => {
    const produtos = await db.find({});
    res.json(produtos);
});

app.post('/cadastrar', async (req, res) => {
    try {
        await dbClientes.insert(req.body);
        res.status(201).json({ status: "Sucesso" });
    } catch (err) {
        res.status(500).json({ status: "Erro" });
    }
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));