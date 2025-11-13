const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ROTA: cadastrar
app.post('/cadastrar', async (req, res) => {
  const { tipo, nome, cpf, dataNascimento, cnpj, razaoSocial, email, senha } = req.body;

  try {
    if (!tipo || !nome || !email || !senha) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    if (tipo === 'PF') {
      const sql = `INSERT INTO PessoaFisica (cpf, nome, dataNascimento, senha, email)
                   VALUES (?, ?, ?, ?, ?)`;
      const params = [cpf || null, nome, dataNascimento || null, senha, email];
      const [result] = await db.query(sql, params);
      console.log('PessoaFisica cadastrada id:', result.insertId);
      return res.status(200).json({ message: 'Pessoa física cadastrada com sucesso.' });
    }

    if (tipo === 'PJ') {
      const sql = `INSERT INTO PessoaJuridica (cnpj, nomeFantasia, razaoSocial, senha, email)
                   VALUES (?, ?, ?, ?, ?)`;
      const params = [cnpj || null, nome || null, razaoSocial || null, senha, email];
      const [result] = await db.query(sql, params);
      console.log('PessoaJuridica cadastrada id:', result.insertId);
      return res.status(200).json({ message: 'Pessoa jurídica cadastrada com sucesso.' });
    }

    return res.status(400).json({ message: 'Tipo inválido.' });
  } catch (error) {
    console.error('Erro ao cadastrar', error.code, error.message);
    return res.status(500).json({ message: 'Erro interno ao salvar no banco de dados.' });
  }
});

// ROTA: login 
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) return res.status(400).json({ message: 'Preencha todos os campos.' });

    // busca na tabela PessoaFisica
    const [pfRows] = await db.query(
      'SELECT idPessoaFisica, cpf, nome, dataNascimento, senha, email FROM PessoaFisica WHERE email = ?',
      [email]
    );

    // busca na tabela PessoaJuridica
    const [pjRows] = await db.query(
      'SELECT idPessoaJuridica, cnpj, nomeFantasia, razaoSocial, senha, email FROM PessoaJuridica WHERE email = ?',
      [email]
    );

    // checar PF
    if (pfRows.length > 0) {
      const u = pfRows[0];
      if (String(u.senha) === String(senha)) {
        // Normaliza o objeto user para enviar ao frontend
        const user = {
          id: u.idPessoaFisica,
          tipo: 'PF',
          nome: u.nome,
          cpf: u.cpf,
          dataNascimento: u.dataNascimento,
          email: u.email
        };
        console.log('Login PF bem sucedido:', email);
        return res.status(200).json({ message: 'Login realizado com sucesso!', user });
      }
    }

    // checar PJ
    if (pjRows.length > 0) {
      const u = pjRows[0];
      if (String(u.senha) === String(senha)) {
        const user = {
          id: u.idPessoaJuridica,
          tipo: 'PJ',
          nome: u.nomeFantasia,
          cnpj: u.cnpj,
          razaoSocial: u.razaoSocial,
          email: u.email
        };
        console.log('Login PJ bem sucedido:', email);
        return res.status(200).json({ message: 'Login realizado com sucesso!', user });
      }
    }

    return res.status(401).json({ message: 'Email ou senha incorretos.' });
  } catch (error) {
    console.error('Erro no login', error.code, error.message, error.sql);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

// start somente após teste rápido de DB
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await db.query('SELECT 1'); // testa conexão
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Banco inacessível na inicialização:', err.code, err.message);
    process.exit(1);
  }
})();
