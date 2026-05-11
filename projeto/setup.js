const datastore = require('nedb-promises');
const db = datastore.create('banco_dados.db');

const inicial = [
  { name: "Sensor Freestyle Libre", price: 299.90, img: "img/sensor-libre.png" },
  { name: "Kit Medidor de Glicose", price: 69.00, img: "img/medidor-glicose.png" },
  { name: "Agulha Uniqmed", price: 39.90, img: "img/agulha-insulina.png" }
];

db.insert(inicial).then(() => console.log("Banco populado!"));