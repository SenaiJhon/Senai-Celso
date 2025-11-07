const express = require("express");
const path = require("path");
const mysql = require("mysql2");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));



// Conexão com o banco

const db = mysql.createConnection({
  host: "localhost",

  user: "root",

  password: "cimatec", // sua senha MySQL

  database: "techstore",
});

//Testando
db.connect((err) => {
  if (err) console.error("Erro ao conectar ao MySQL:", err.message);
  else console.log("Conectado ao MySQL!");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Rota para receber o Post do formulário

app.post('/salvar', (req, res) => {
    const { nome, descricao, preco , estoque} = req.body;
    const sql = 'INSERT INTO produtos(nome , descricao, preco , estoque) Value ( ? , ? , ? , ?)';
    db.query(sql, [nome, descricao, parseFloat(preco) , parseInt(estoque)], (err) => {
        if (err) {
            console.error('Erro ao inserir dados:', err.message);
            return res.send('❌ Erro ao salvar no banco.');
        }
        res.send('✅ Dados salvos com sucesso!');
    });
});

app.get("/busca", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "busca.html"));
});

// API de busca por nome

app.get("/api/buscar", (req, res) => {
  const { nome } = req.query;
  if (!nome) return res.json([]);

  const sql = "SELECT * FROM produtos WHERE nome LIKE ?";

  db.query(sql, [`%${nome}%`], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar no banco." });

    res.json(results);
  });
});

app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3030/")
);
