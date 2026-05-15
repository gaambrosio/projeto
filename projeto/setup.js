const datastore = require('nedb-promises');

// Cria ou carrega o banco de dados
const db = datastore.create({
    filename: 'banco_dados.db',
    autoload: true
});

const produtosIniciais = [
    { name: "Sensor Freestyle Libre", price: 299.90, img: "img/sensor-libre.png" },
    { name: "Kit Medidor de Glicose", price: 69.00, img: "img/medidor-glicose.png" },
    { name: "Agulha Uniqmed", price: 39.90, img: "img/agulha-insulina.png" }
];

async function popularBanco() {
    try {
        const produtosExistentes = await db.find({});
        if (produtosExistentes.length > 0) {
            console.log("O banco já possui produtos. Operação cancelada para evitar duplicidade.");
            return;
        }

        await db.insert(produtosIniciais);
        console.log("Sucesso: Banco de dados populado com os produtos iniciais!");
    } catch (err) {
        console.error("Erro ao popular o banco:", err);
    }
}

popularBanco();