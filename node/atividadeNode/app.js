const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql2 = require('mysql2');

const app = express();

//Configurações básicas do express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const mysql = require('mysql2');

//conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost', //seu host
    user: 'root', //seu usuario sql
    password:'cimatec', //senha do sql
    database:'aula2910_2' //nome do database
})

connection.connect(err=>{
    if (err){
        console.error('Erro ao conectar ao MySQL:', err.message);
        return;
    }
    console.log('Conexão com MySQL estabelecida com sucesso!')
});

// Rota Principal(Página do formulario)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'index.html'))
})

//Rota para receber o POST do formulário
//aqui eu faço o caminho que os dados do formulario vão percorrer até o SQL
app.post('/salvar', (req,res)=>{
    const { nomeProduto, descricao, preco } = req.body; //HTML
    const sql = 'INSERT INTO produtos (nomeProduto, descricao, preco) VALUES (?, ?, ?)'; //SQL
    connection.query(sql,[nomeProduto, descricao, parseFloat(preco)], (err)=>{
        if (err) {
            console.error('Erro ao inserir dados:', err.message);
            return res.send('❌ Erro ao salvar no banco');
        }
        res.send('✅ Dados salvos com sucesso!');
    });
});

app.get('/busca', (req,res)=>{
        res.sendFile(path.join(__dirname, 'public', 'busca.html'));
});

//API de busca por nome
app.get('/api/busca',(resq,res)=>{
    const{nomeProduto}= req.query;
    if(!nomeProduto) return res.json([]);

    const sql = 'SELECT * FROM usuarios WHERE nome LIKE ?';
    connection.query(sql,[`%${nomeProduto}%`] , (err , results) =>{
        if(err) return res.status(500).json({error: 'ERRO ao buscar no banco'});
        res.json(results);
    });

})



//inicia o servidor 
app.listen(3030, ()=> console.log('Servidor rodando em http://localhost:3030/busca'));
