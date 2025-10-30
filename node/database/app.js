const mysql = require('mysql2');

//conexão simples

const connection = mysql.createConnection({
    host: 'localhost', //seu hoste(localhost)
    user: 'root', //seu user mysql
    password: 'cimatec', // sua senha mysql
    database: 'aula2910' // seu database
})


//connection test

connection.connect(err =>{
    if(err){
        console.err('[X] Erro ao concectar no mySql:' , err.message);
        return;
    }
    console.log('[V] Conexão estabelecida com sucesso!');
    connection.end();// Atenção a depender do node encerra e da erro
})