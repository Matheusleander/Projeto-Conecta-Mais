//importar o pacote 'dotenv' para carregar as variáveis do  arquivo .env

require('dotenv').config();

//importar a versão 'promise' do mysql12, para usar async/await

const mysql = require('mysql2/promise');

//cria um pool de conexões, mais recomendado
//o pool gerencia conexões reutilizáveis e melhora a performance

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || 'conectamais',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//exporta a conexão para ser usada em outros arquivos do projeto
module.exports = pool;