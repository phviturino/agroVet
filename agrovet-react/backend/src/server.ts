import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados MySQL do XAMPP
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Senha padrão do XAMPP
  database: 'saudeanimal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/* ==========================================================================
   1. ROTAS DE PRODUTOS
   ========================================================================== */

// ROTA DE DESTAQUES (Precisa vir ANTES de /api/produtos/:id)
app.get('/api/produtos/destaque', async (req, res) => {
  try {
    const [rows]: any = await db.query('CALL sp_produtos_destaque()');
    const produtos = Array.isArray(rows[0]) ? rows[0] : rows;
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar destaques:', error);
    res.status(500).json({ erro: 'Erro interno ao buscar produtos em destaque.' });
  }
});

// LISTAR TODOS OS PRODUTOS
app.get('/api/produtos', async (req, res) => {
  try {
    const { busca } = req.query;
    let query = `
      SELECT 
        p.id, 
        p.nome, 
        p.preço, 
        p.imagem, 
        p.descricao,
        c.nome AS categoria 
      FROM produto p
      LEFT JOIN categoria c ON p.id_categoria = c.id
    `;
    const params: any[] = [];

    if (busca) {
      query += ` WHERE p.nome LIKE ?`;
      params.push(`%${busca}%`);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao procurar produtos no MySQL:', error);
    res.status(500).json({ erro: 'Erro interno ao procurar produtos.' });
  }
});

// BUSCAR PRODUTO ESPECÍFICO POR ID
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        p.id, 
        p.nome, 
        p.preço, 
        p.imagem, 
        p.descricao,
        c.nome AS categoria 
      FROM produto p
      LEFT JOIN categoria c ON p.id_categoria = c.id
      WHERE p.id = ?
    `;
    const [rows]: any = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar detalhe do produto:', error);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

// CADASTRAR PRODUTO (POST)
app.post('/api/produtos', async (req, res) => {
  try {
    const { nome, preço, imagem, descricao } = req.body;
    const [result]: any = await db.query(
      'INSERT INTO produto (nome, preço, imagem, descricao) VALUES (?, ?, ?, ?)',
      [nome, preço, imagem || null, descricao || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Produto criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar produto.' });
  }
});

// ATUALIZAR/SALVAR PRODUTO (PUT)
app.put('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preço, imagem, descricao } = req.body;

    const [result]: any = await db.query(
      'UPDATE produto SET nome = ?, preço = ?, imagem = ?, descricao = ? WHERE id = ?',
      [nome, preço, imagem || null, descricao || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado para atualizar.' });
    }

    res.json({ message: 'Produto atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ erro: 'Erro ao atualizar produto no banco.' });
  }
});

// EXCLUIR PRODUTO (DELETE)
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM produto WHERE id = ?', [id]);
    res.json({ message: 'Produto excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ erro: 'Erro ao excluir produto.' });
  }
});

/* ==========================================================================
   2. ROTAS DE CATEGORIAS (Com tratamento da coluna `descrição` do MySQL)
   ========================================================================== */

app.get('/api/categorias', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nome, `descrição` AS descricao FROM categoria');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar categorias.' });
  }
});

app.get('/api/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows]: any = await db.query(
      'SELECT id, nome, `descrição` AS descricao FROM categoria WHERE id = ?', 
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ erro: 'Categoria não encontrada.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar categoria.' });
  }
});

app.post('/api/categorias', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    
    if (!nome) {
      return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' });
    }

    // Insere no banco passando a chave 'descricao' do React para a coluna `descrição`
    const [result]: any = await db.query(
      'INSERT INTO categoria (nome, `descrição`) VALUES (?, ?)',
      [nome, descricao || '']
    );
    res.status(201).json({ id: result.insertId, message: 'Categoria cadastrada com sucesso!' });
  } catch (error: any) {
    console.error('Erro ao cadastrar categoria no MySQL:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar categoria no banco de dados.' });
  }
});

app.put('/api/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    
    await db.query(
      'UPDATE categoria SET nome = ?, `descrição` = ? WHERE id = ?', 
      [nome, descricao || '', id]
    );
    res.json({ message: 'Categoria atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ erro: 'Erro ao atualizar categoria.' });
  }
});

app.delete('/api/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM categoria WHERE id = ?', [id]);
    res.json({ message: 'Categoria excluída com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir categoria.' });
  }
});

/* ==========================================================================
   3. ROTAS DE FORNECEDORES
   ========================================================================== */

app.get('/api/fornecedores', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM fornecedor');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar fornecedores.' });
  }
});

app.get('/api/fornecedores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows]: any = await db.query('SELECT * FROM fornecedor WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar fornecedor.' });
  }
});

app.post('/api/fornecedores', async (req, res) => {
  try {
    const { nome, cnpj, telefone, email } = req.body;
    const [result]: any = await db.query(
      'INSERT INTO fornecedor (nome, cnpj, telefone, email) VALUES (?, ?, ?, ?)',
      [nome, cnpj || null, telefone || null, email || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Fornecedor cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar fornecedor:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar fornecedor.' });
  }
});

app.put('/api/fornecedores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cnpj, telefone, email } = req.body;
    await db.query(
      'UPDATE fornecedor SET nome = ?, cnpj = ?, telefone = ?, email = ? WHERE id = ?', 
      [nome, cnpj || null, telefone || null, email || null, id]
    );
    res.json({ message: 'Fornecedor atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({ erro: 'Erro ao atualizar fornecedor.' });
  }
});

app.delete('/api/fornecedores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM fornecedor WHERE id = ?', [id]);
    res.json({ message: 'Fornecedor excluído com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir fornecedor.' });
  }
});

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend a rodar em http://localhost:${PORT}`);
});