# 🌐 ConectaMais

## 📝 Descrição  
O **ConectaMais** é um projeto desenvolvido no curso de **Programador Web**, com o objetivo de praticar e integrar diversas tecnologias de desenvolvimento web.  
O sistema realiza o **cadastro de pessoas físicas e jurídicas** e permite o **login** dos usuários, redirecionando-os para a página principal após a autenticação.

## 🧰 Tecnologias Utilizadas
- **Banco de Dados:** MySQL  
- **Ferramentas:** MySQL Workbench, XAMPP, VS Code  
- **Front-end:** HTML, CSS, Bootstrap, JavaScript  
- **Back-end:** Node.js  

## 📂 Estrutura do Projeto

CONECTAMAIS/
│
├── conectamais/
│
├── database/
│ └── conectamais.sql # Script do banco de dados
│
├── node_modules/ # Dependências do Node.js
│
├── public/
│ ├── css/ # Arquivos de estilo
│ ├── js/ # Scripts de validação e login
│ │ ├── login.js
│ │ ├── validacoes.js
│ ├── cadastro.html # Página de cadastro
│ ├── index.html # Página principal
│ └── login.html # Página de login
│
├── src/
│ ├── db.js # Configuração de conexão com o banco de dados
│ └── server.js # Servidor principal (Node.js / Express)
│
├── .env # Variáveis de ambiente (configurações do banco)
├── package.json # Dependências e scripts do projeto
├── package-lock.json
└── readme.md # Documentação do projeto

## 🚀 Funcionalidades
- Cadastro de **pessoas físicas e jurídicas**  
- Sistema de **login e autenticação**  
- Redirecionamento para a **página principal** após login bem-sucedido  
- Validação de dados com **JavaScript**

## ⚙️ Como Executar o Projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/usuario/conectamais.git

Instale as dependências

bash

npm install

Configure o arquivo .env com os dados do seu banco MySQL:


DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=conectamais

Importe o banco de dados

Use o arquivo database/conectamais.sql no MySQL Workbench ou phpMyAdmin.

Execute o servidor

bash

node src/server.js

Acesse o sistema
Abra o navegador e vá até: http://localhost:3000