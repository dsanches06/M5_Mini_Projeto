"use strict";

const mysql = require("mysql");
const options = require("./connectionOptions.json");

/* Função para criar uma nova conexão com o banco de dados */
function createConnection(sql) {
  return mysql.createConnection(options);
}

/* Função para fechar a conexão com o banco de dados */
function endConnection(connection) {
  connection.end((err) => {
    if (err) {
      console.error("Erro ao fechar a conexão:", err);
    } else {
      console.log("Conexão fechada com sucesso.");
    }
  });
}

module.exports = {
  createConnection,
  endConnection,
};