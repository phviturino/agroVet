import bcrypt from 'bcrypt';
import { Usuario } from './models/Usuario';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { authMiddleware } from './middlewares/authMiddleware';


const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET; /*Ler a chave secreta do .env*/

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não configurada no arquivo .env');
}

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Senha padrão do XAMPP
  database: 'saudeanimal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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

app.post('/api/usuarios', async (req, res) => {
  const { nome, email, senha, cpf, telefone } = req.body ?? {};

  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof senha !== 'string' || !senha ||
    typeof cpf !== 'string' || !cpf.trim() ||
    typeof telefone !== 'string' || !telefone.trim()
  ) {
    return res.status(400).json({
      mensagem: 'Todos os campos são obrigatórios!'
    });
  }

  const senhaValida =
    senha.length >= 8 &&
    /[A-Z]/.test(senha) &&
    /[a-z]/.test(senha) &&
    /[0-9]/.test(senha) &&
    /[^A-Za-z0-9]/.test(senha);

  if (!senhaValida) {
    return res.status(400).json({
      mensagem: 'A senha deve ter pelo menos 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
    });
  }

  try {
    const usuario = new Usuario(nome, email, cpf, telefone);

    const senhaHash = await bcrypt.hash(senha, 12);

    await db.execute(
      `INSERT INTO usuario (nome, email, cpf, telefone, senha)
       VALUES (?, ?, ?, ?, ?)`,
      [
        usuario.nome,
        usuario.email,
        usuario.cpf,
        usuario.telefone,
        senhaHash
      ]
    );

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!'
    });

  } catch (erro: unknown) {
    if (erro instanceof Error && [
      'O nome não pode estar vazio!',
      'Formato de e-mail inválido!',
      'CPF inválido!',
      'Telefone inválido!'
    ].includes(erro.message)) {
      return res.status(400).json({
        mensagem: erro.message
      });
    }

    const erroBanco = erro as { code?: string };

    if (erroBanco.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        mensagem: 'E-mail ou CPF já cadastrado!'
      });
    }

    console.error('Erro ao cadastrar usuário:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno ao cadastrar usuário!'
    });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body ?? {};

  if (typeof email !== 'string' || !email.trim() ||
      typeof senha !== 'string' || !senha) {
    return res.status(400).json({
      mensagem: 'E-mail e senha são obrigatórios!'
    });
  }

  try {
    const [rows]: any = await db.execute(
      'SELECT id, nome, email, senha FROM usuario WHERE email = ?',
      [email.trim()]
    );

    const usuario = rows[0];

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha incorretos!'
      });
    }

    const token = jwt.sign(
      { id: usuario.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (erro) {
    console.error('Erro ao realizar login:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno ao realizar login!'
    });
  }
});

app.get('/api/perfil', authMiddleware, (req, res) => {
  res.status(200).json({
    mensagem: 'Acesso autorizado! Token JWT válido.'
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});