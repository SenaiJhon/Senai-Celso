const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql2 = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

// Configuração de sessão
app.use(session({
    secret: 'construtora-pedra-forte-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Middleware para verificar autenticação
function requireAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}

//Configurações básicas do express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const mysql = require('mysql2');


// Conexão com o banco

const db = mysql.createConnection({
  host: "localhost",

  user: "root",

  password: "cimatec", // sua senha MySQL

  database: "estoque",
});

//Testando
db.connect((err) => {
  if (err) console.error("Erro ao conectar ao MySQL:", err.message);
  else console.log("Conectado ao MySQL!");
});

// Rota principal - Dashboard (protegida)
app.get("/", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname , "public" , "index.html"));
});

// Rota de login
app.get("/login", (req, res) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname , "public" , "login.html"));
});

// Rota de logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao fazer logout:", err);
    }
    res.redirect('/login');
  });
});

// Rota principal - cadastro (protegida)
app.get("/cadastro", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname , "public" , "cadastro.html"));
});

app.get("/lista", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname , "public" , "lista.html"));
});

app.get("/api/materiais", requireAuth, (req, res) => {
  const sql = "SELECT * FROM materiais";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar materiais:", err);
      return res.status(500).json({ error: "Erro ao buscar materiais" });
    }
    res.json(results);
  });
});

app.post("/login", async (req, res) => {
  const { username, senha } = req.body;
  
  try {
    // Buscar usuário no banco
    const sql = "SELECT * FROM usuarios WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.error("Erro ao buscar usuário:", err);
        return res.status(500).send("Erro ao processar login");
      }
      
      if (results.length === 0) {
        return res.status(401).send("Credenciais inválidas");
      }
      
      const user = results[0];
      
      // Verificar senha (comparar com hash)
      const senhaValida = await bcrypt.compare(senha, user.password);
      
      if (!senhaValida) {
        return res.status(401).send("Credenciais inválidas");
      }
      
      // Criar sessão
      req.session.userId = user.id;
      req.session.username = user.username;
      
      res.send("Login bem-sucedido");
    });
  } catch (error) {
    console.error("Erro ao processar login:", error);
    res.status(500).send("Erro ao processar login");
  }
});




app.get("/busca", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "busca.html"));
});

// Rota para página de edição (protegida) - HTML inline
app.get("/editar", requireAuth, (req, res) => {
  const editarHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Material - Construtora Pedra Forte</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 { text-align: center; color: #333; margin-bottom: 30px; }
        form { display: flex; flex-direction: column; gap: 15px; }
        label { font-weight: bold; color: #555; }
        input, select, textarea { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em; }
        textarea { resize: vertical; min-height: 80px; }
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        button {
            background-color: #4CAF50; color: white; padding: 12px; border: none; border-radius: 4px;
            font-size: 1em; font-weight: bold; cursor: pointer; transition: background-color 0.3s ease;
        }
        button:hover { background-color: #45a049; }
        .back-link { display: inline-block; margin-top: 20px; color: #4CAF50; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
        .error-message { color: #f44336; text-align: center; margin-top: 10px; display: none; }
        .loading { text-align: center; color: #666; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>✏️ Editar Material</h1>
        <div id="loadingMessage" class="loading">Carregando dados do material...</div>
        <form id="editForm" style="display: none;">
            <div class="form-group">
                <label for="nome">Nome do Material:</label>
                <input type="text" id="nome" name="nome" required />
            </div>
            <div class="form-group">
                <label for="descricao">Descrição:</label>
                <textarea id="descricao" name="descricao" required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="preco">Preço (R$):</label>
                    <input type="number" id="preco" name="preco" step="0.01" min="0" required />
                </div>
                <div class="form-group">
                    <label for="quantidade">Quantidade:</label>
                    <input type="number" id="quantidade" name="quantidade" min="0" required />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="unidade">Unidade:</label>
                    <select id="unidade" name="unidade" required>
                        <option value="">Selecione...</option>
                        <option value="kg">kg</option>
                        <option value="un">un</option>
                        <option value="m">m</option>
                        <option value="m²">m²</option>
                        <option value="m³">m³</option>
                        <option value="l">l</option>
                        <option value="cx">cx</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="categoria">Categoria:</label>
                    <select id="categoria" name="categoria" required>
                        <option value="">Selecione...</option>
                        <option value="Cimento e Argamassa">Cimento e Argamassa</option>
                        <option value="Tijolos e Blocos">Tijolos e Blocos</option>
                        <option value="Madeiras">Madeiras</option>
                        <option value="Ferragens">Ferragens</option>
                        <option value="Elétrica">Elétrica</option>
                        <option value="Hidráulica">Hidráulica</option>
                        <option value="Tintas e Vernizes">Tintas e Vernizes</option>
                        <option value="Revestimentos">Revestimentos</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="fornecedor">Fornecedor:</label>
                <input type="text" id="fornecedor" name="fornecedor" required />
            </div>
            <button type="submit">Atualizar Material</button>
        </form>
        <div id="errorMessage" class="error-message"></div>
        <a href="/lista" class="back-link">← Voltar à Lista</a>
    </div>
    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const materialId = urlParams.get('id');
        if (!materialId) {
            alert('ID do material não fornecido');
            window.location.href = '/lista';
        }
        async function loadMaterial() {
            try {
                const response = await fetch(\`/api/materiais/\${materialId}\`);
                if (!response.ok) throw new Error('Material não encontrado');
                const material = await response.json();
                document.getElementById('nome').value = material.nome;
                document.getElementById('descricao').value = material.descricao;
                document.getElementById('preco').value = material.preco;
                document.getElementById('quantidade').value = material.quantidade;
                document.getElementById('unidade').value = material.unidade;
                document.getElementById('categoria').value = material.categoria;
                document.getElementById('fornecedor').value = material.fornecedor;
                document.getElementById('loadingMessage').style.display = 'none';
                document.getElementById('editForm').style.display = 'block';
            } catch (error) {
                document.getElementById('loadingMessage').textContent = 'Erro ao carregar material: ' + error.message;
                document.getElementById('loadingMessage').style.color = '#f44336';
            }
        }
        document.getElementById('editForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                nome: formData.get('nome'),
                descricao: formData.get('descricao'),
                preco: parseFloat(formData.get('preco')),
                quantidade: parseInt(formData.get('quantidade')),
                unidade: formData.get('unidade'),
                categoria: formData.get('categoria'),
                fornecedor: formData.get('fornecedor')
            };
            try {
                const response = await fetch(\`/api/materiais/\${materialId}\`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    alert('Material atualizado com sucesso!');
                    window.location.href = '/lista';
                } else {
                    const error = await response.json();
                    document.getElementById('errorMessage').textContent = error.error || 'Erro ao atualizar material';
                    document.getElementById('errorMessage').style.display = 'block';
                }
            } catch (error) {
                document.getElementById('errorMessage').textContent = 'Erro ao conectar ao servidor';
                document.getElementById('errorMessage').style.display = 'block';
            }
        });
        loadMaterial();
    </script>
</body>
</html>
  `;
  res.send(editarHtml);
});

// API para buscar um material específico (GET)
app.get("/api/materiais/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM materiais WHERE id = ?";
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar material:", err);
      return res.status(500).json({ error: "Erro ao buscar material" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Material não encontrado" });
    }
    
    res.json(results[0]);
  });
});


//Rota para receber o Post do formulário (com validações)

app.post('/salvar', requireAuth, (req, res) => {
    const { nome, descricao, preco , quantidade ,unidade  , categoria , fornecedor} = req.body;
    
    // Validações
    if (!nome || nome.trim() === '') {
        return res.status(400).send('❌ Nome do material é obrigatório.');
    }
    
    if (parseInt(quantidade) < 0) {
        return res.status(400).send('❌ Quantidade não pode ser negativa.');
    }
    
    if (parseFloat(preco) < 0) {
        return res.status(400).send('❌ Preço não pode ser negativo.');
    }
    
    // Verificar se material já existe
    const checkSql = 'SELECT id FROM materiais WHERE nome = ?';
    db.query(checkSql, [nome], (err, results) => {
        if (err) {
            console.error('Erro ao verificar material existente:', err.message);
            return res.status(500).send('❌ Erro ao verificar material existente.');
        }
        
        if (results.length > 0) {
            return res.status(400).send('❌ Material já cadastrado no sistema.');
        }
        
        // Inserir novo material
        const sql = 'INSERT INTO materiais (nome, descricao, quantidade, preco, unidade, categoria, fornecedor) VALUES ( ? , ? , ? , ? , ? , ? , ?)';
        db.query(sql, [nome, descricao, parseFloat(preco) , parseInt(quantidade), unidade  , categoria , fornecedor], (err) => {
            if (err) {
                console.error('Erro ao inserir dados:', err.message);
                return res.send('❌ Erro ao salvar no banco.');
            }
            res.send('✅ Dados salvos com sucesso!');
        });
    });
});


// API de busca por nome (protegida)

app.get("/api/buscar", requireAuth, (req, res) => {
  const { nome } = req.query;
  if (!nome) {
    return res.status(400).json({ error: "Parâmetro 'nome' é obrigatório" });
  }

  const sql = "SELECT * FROM materiais WHERE nome LIKE ?";
  const termo = `%${nome}%`;

  db.query(sql, [termo], (err, results) => {
    if (err) {
      console.error("Erro ao buscar materiais:", err);
      return res.status(500).json({ error: "Erro ao buscar materiais" });
    }
    res.json(results);
  });
});

// API para atualizar material (PUT)
app.put("/api/materiais/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { nome, descricao, quantidade, preco, unidade, categoria, fornecedor } = req.body;
  
  // Validações
  if (!nome || nome.trim() === '') {
    return res.status(400).json({ error: 'Nome do material é obrigatório.' });
  }
  
  if (parseInt(quantidade) < 0) {
    return res.status(400).json({ error: 'Quantidade não pode ser negativa.' });
  }
  
  if (parseFloat(preco) < 0) {
    return res.status(400).json({ error: 'Preço não pode ser negativo.' });
  }
  
  const sql = `UPDATE materiais SET 
               nome = ?, descricao = ?, quantidade = ?, preco = ?, 
               unidade = ?, categoria = ?, fornecedor = ?, 
               data_atualizacao = CURRENT_TIMESTAMP 
               WHERE id = ?`;
  
  db.query(sql, [nome, descricao, parseInt(quantidade), parseFloat(preco), 
                   unidade, categoria, fornecedor, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar material:", err);
      return res.status(500).json({ error: "Erro ao atualizar material" });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Material não encontrado" });
    }
    
    res.json({ message: "Material atualizado com sucesso!" });
  });
});

// API para excluir material (DELETE)
app.delete("/api/materiais/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  
  const sql = "DELETE FROM materiais WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erro ao excluir material:", err);
      return res.status(500).json({ error: "Erro ao excluir material" });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Material não encontrado" });
    }
    
    res.json({ message: "Material excluído com sucesso!" });
  });
});


app.listen(3030, ()=> console.log('Servidor rodando em http://localhost:3030/'));

