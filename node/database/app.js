const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');


const app = express();

//configurações

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//conexão simples com o banco

const db = mysql.createConnection({
    host: 'localhost', //seu hoste(localhost)
    user: 'root', //seu user mysql
    password: 'cimatec', // sua senha mysql
    database: 'aula2910' // seu database
})


//connection test

db.connect(err => {
    if (err) {
        console.err('❌  Erro ao concectar no mySql:', err.message);
        return;
    }
    console.log('✅ Conexão estabelecida com sucesso!');
    
})

//rota principal (página do formulário)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Rota para receber o Post do formulário

app.post('/salvar', (req, res) => {
    const { nome, email, telefone } = req.body;
    const sql = 'INSERT INTO usuarios(nome , email, telefone) Value ( ? , ? , ?)';
    db.query(sql, [nome, email, telefone], (err) => {
        if (err) {
            console.error('Erro ao inserir dados:', err.message);
            return res.send('❌ Erro ao salvar no banco.');
        }
        res.send('✅ Dados salvos com sucesso!');
    });
});


app.get('/busca', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'busca.html'));
});

//API de busca por nome
app.get('/api/busca',(req,res)=>{
    const{nome}= req.query;
    if(!nome) return res.json([]);
    
    const sql = 'SELECT * FROM usuarios WHERE nome LIKE ?';
    db.query(sql,[`%${nome}%`] , (err , results) =>{
        if(err) return res.status(500).json({error: 'ERRO ao buscar no banco'});
        res.json(results);
    });
    
});
//inicia o sever

app.listen(3030 , () => console.log('Servidor rodando em http://localhost:3030/busca'));
