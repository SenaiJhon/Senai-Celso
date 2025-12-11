// ====================================================================
// 1. CONFIGURAÇÕES E IMPORTAÇÕES
// ====================================================================
const express = require('express');
const mysql2 = require('mysql2/promise'); // para async/await
const path = require('path');

const app = express();
const PORT = 3030;

// MIDDLEWARES
app.use(express.json()); // Habilita o Express a ler JSON no body

// Servir arquivos estáticos do Front-end (login.html, home.html, etc.)
// Assume-se que o server.js está em 'backend/' e os arquivos front-end em '../frontend'
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// CONFIGURAÇÃO DO BANCO DE DADOS
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'cimatec', // !!! SUBSTITUIR PELA SUA SENHA DO MYSQL !!!
    database: 'saep_db'
};

let connection;

// Função para conectar ao banco
async function connectDB() {
    try {
        connection = await mysql2.createConnection(dbConfig);
        console.log('✅ Conexão com o MySQL (saep_db) estabelecida!');
    } catch (error) {
        console.error('❌ Erro ao conectar ao MySQL:', error.message);
        process.exit(1);
    }
}
async function ensureProdutoAtivoColumn() {
    try {
        const [rows] = await connection.execute(
            "SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'PRODUTO' AND COLUMN_NAME = 'ativo'",
            [dbConfig.database]
        );
        if (rows[0].c === 0) {
            await connection.execute("ALTER TABLE PRODUTO ADD COLUMN ativo TINYINT(1) DEFAULT 1 NOT NULL");
            await connection.execute("UPDATE PRODUTO SET ativo = 1 WHERE ativo IS NULL");
        }
    } catch (_) {
    }
}
connectDB().then(ensureProdutoAtivoColumn);

// ====================================================================
// 2. ROTAS DE AUTENTICAÇÃO (USUARIO)
// ====================================================================

/**
 * ROTA: POST /login (RF01)
 * Verifica as credenciais do usuário.
 */
app.post('/login', async (req, res) => {
    const { login, senha } = req.body;


    if (!login || !senha) {
        return res.status(400).json({ message: 'Login e senha são obrigatórios.' });
    }

    try {
        // Busca na tabela USUARIO
        const query = 'SELECT id_usuario, nome FROM USUARIO WHERE login = ? AND senha = ?';
        const [rows] = await connection.execute(query, [login, senha]);

        if (rows.length === 0) {
            // RF01: Falha de autenticação (401 Unauthorized)
            return res.status(401).json({ message: 'Login ou senha inválidos. Tente novamente.' });
        }

        const user = rows[0];
        // Sucesso: Retorna o ID e o Nome (RF03)
        res.json({
            id: user.id_usuario,
            nome: user.nome,
            message: 'Autenticação bem-sucedida.'
        });

    } catch (error) {
        console.error('Erro na rota /login:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao tentar login.' });

    }

});

// ====================================================================
// 3. ROTAS DE PRODUTOS (CRUD - RF05, RF06)
// ====================================================================

/**
 * ROTA: GET /produtos (RF05, RF06)
 * Lista produtos com busca opcional.
 */
app.get('/produtos', async (req, res) => {
    // Implementação da busca (RF06)
    const termoBusca = req.query.termo ? `%${req.query.termo}%` : '%';
    const baseQuery = 'SELECT * FROM PRODUTO WHERE ativo = 1 AND (nome LIKE ? OR descricao_detalhada LIKE ?)';

    try {
        const [produtos] = await connection.execute(baseQuery, [termoBusca, termoBusca]);
        res.json(produtos);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ message: 'Erro interno ao buscar produtos.' });
    }
});

/**
 * ROTA: POST /produtos (RF05)
 * Cria um novo produto.
 */
app.post('/produtos', async (req, res) => {
    const { nome, descricao_detalhada, unidade_medida, estoque_atual, estoque_minimo, material_cabeca, tipo_ponta } = req.body;

    // RF07: Validação de dados mínima
    if (!nome || !unidade_medida || estoque_minimo === undefined) {
        return res.status(400).json({ message: 'Campos essenciais (nome, unidade, estoque_minimo) são obrigatórios.' });
    }

    const query = 'INSERT INTO PRODUTO (nome, descricao_detalhada, unidade_medida, estoque_atual, estoque_minimo, material_cabeca, tipo_ponta) VALUES (?, ?, ?, ?, ?, ?, ?)';

    try {
        const [result] = await connection.execute(query, [nome, descricao_detalhada, unidade_medida, estoque_atual || 0, estoque_minimo, material_cabeca || null, tipo_ponta || null]);
        res.status(201).json({ id: result.insertId, message: 'Produto cadastrado com sucesso.' });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ message: 'Erro interno ao cadastrar produto.' });
    }
});

/**
 * ROTA: PUT /produtos/:id (RF05)
 * Edita um produto existente.
 */
app.put('/produtos/:id', async (req, res) => {
    const id = req.params.id;
    const { nome, descricao_detalhada, unidade_medida, estoque_minimo, material_cabeca, tipo_ponta } = req.body;

    if (!nome || !unidade_medida || estoque_minimo === undefined) {
        return res.status(400).json({ message: 'Campos essenciais (nome, unidade, estoque_minimo) são obrigatórios para edição.' });
    }

    const query = 'UPDATE PRODUTO SET nome = ?, descricao_detalhada = ?, unidade_medida = ?, estoque_minimo = ?, material_cabeca = ?, tipo_ponta = ? WHERE id_produto = ?';

    try {
        const [result] = await connection.execute(query, [nome, descricao_detalhada, unidade_medida, estoque_minimo, material_cabeca || null, tipo_ponta || null, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado para edição.' });
        }

        res.json({ message: 'Produto atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        res.status(500).json({ message: 'Erro interno ao atualizar produto.' });
    }
});

/**
 * ROTA: DELETE /produtos/:id (RF05)
 * Exclui um produto.
 */
app.delete('/produtos/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'DELETE FROM PRODUTO WHERE ID_PRODUTO = ?';
        const [result] = await connection.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado ou já inativo.' });
        }

        return res.status(204).end();
    } catch (error) {
        console.error('Erro ao excluir produto ( delete):', error);
        res.status(500).json({ message: 'Erro interno ao realizar exclusão lógica do produto.' });
    }
});


// ====================================================================
// 4. ROTAS DE MOVIMENTAÇÃO DE ESTOQUE (RF08, RF09, RF10)
// ====================================================================

/**
 * ROTA: POST /movimentacoes
 * Registra a movimentação e atualiza o estoque (RF08, RF09, RF10).
 */
app.post('/movimentacoes', async (req, res) => {
    const { id_produto, id_usuario, tipo_movimentacao, quantidade, observacao, data_movimentacao } = req.body;

    if (!id_produto || !id_usuario || !tipo_movimentacao || !quantidade || quantidade <= 0) {
        return res.status(400).json({ message: 'Dados de movimentação incompletos ou inválidos.' });
    }

    // Conexão temporária para Transação (Garantia de atomicidade: ou tudo ou nada)
    const connectionTrans = await mysql2.createConnection(dbConfig);
    await connectionTrans.beginTransaction(); // Inicia a transação

    try {
        const [produtoRows] = await connectionTrans.execute(
            'SELECT estoque_atual, nome, ativo FROM PRODUTO WHERE id_produto = ?',
            [id_produto]
        );
        if (produtoRows.length === 0) {
            await connectionTrans.rollback();
            await connectionTrans.end();
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        const produtoAtual = produtoRows[0];
        if (produtoAtual.ativo === 0) {
            await connectionTrans.rollback();
            await connectionTrans.end();
            return res.status(400).json({ message: 'Produto inativo. Não é possível movimentar estoque.' });
        }
        if (tipo_movimentacao === 'SAIDA') {
            if (produtoAtual.estoque_atual < quantidade) {
                await connectionTrans.rollback();
                await connectionTrans.end();
                return res.status(400).json({
                    message: `Estoque insuficiente! Disponível: ${produtoAtual.estoque_atual} ${produtoAtual.nome}. Solicitado: ${quantidade}.`,
                    estoqueDisponivel: produtoAtual.estoque_atual
                });
            }
            if (produtoAtual.estoque_atual === 0) {
                await connectionTrans.rollback();
                await connectionTrans.end();
                return res.status(400).json({
                    message: `Produto esgotado! Não é possível realizar saída de ${produtoAtual.nome}.`,
                    estoqueDisponivel: 0
                });
            }
        }

        // 1. (RF09) REGISTRO NA MOVIMENTACAO
        // Usa a data informada pelo usuário (YYYY-MM-DD) ou a atual
        let dataMov = new Date();
        if (data_movimentacao) {
            const parsed = new Date(data_movimentacao);
            if (!isNaN(parsed.getTime())) {
                dataMov = parsed;
            }
        }
        const queryMov = 'INSERT INTO MOVIMENTACAO (id_produto, id_usuario, tipo_movimentacao, quantidade, data_movimentacao, observacao) VALUES (?, ?, ?, ?, ?, ?)';
        await connectionTrans.execute(queryMov, [id_produto, id_usuario, tipo_movimentacao, quantidade, dataMov, observacao || null]);

        // 2. ATUALIZAÇÃO DO ESTOQUE (RF08)
        const operacao = tipo_movimentacao === 'ENTRADA' ? '+' : '-';
        const queryEstoque = `UPDATE PRODUTO SET estoque_atual = estoque_atual ${operacao} ? WHERE id_produto = ?`;
        await connectionTrans.execute(queryEstoque, [quantidade, id_produto]);

        // 3. (RF10) VERIFICAÇÃO DE ALERTA DE ESTOQUE MÍNIMO
        let alertaEstoque = false;

        if (tipo_movimentacao === 'SAIDA') {
            const [rows] = await connectionTrans.execute('SELECT estoque_atual, estoque_minimo FROM PRODUTO WHERE id_produto = ?', [id_produto]);
            const produto = rows[0];

            if (produto && produto.estoque_atual < produto.estoque_minimo) {
                alertaEstoque = true;
            }
        }

        await connectionTrans.commit(); // Confirma a transação

        // Retorna o status e o alerta (RF10) para o Front-end
        res.json({
            message: 'Movimentação registrada e estoque atualizado.',
            alerta: alertaEstoque
        });

    } catch (error) {
        await connectionTrans.rollback(); // Desfaz todas as operações em caso de erro
        console.error('Erro na transação de movimentação:', error);
        res.status(500).json({ message: 'Erro interno ao processar a movimentação de estoque.' });
    } finally {
        await connectionTrans.end(); // Fecha a conexão da transação
    }
});


// ====================================================================
// 5. INICIALIZAÇÃO DO SERVIDOR
// ====================================================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express rodando em http://localhost:${PORT}`);
});
