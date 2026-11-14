import bcrypt from 'bcrypt';
import { Usuario } from './models/Usuario';
import { Administrador } from './models/Administrador';
import { Cliente } from './models/Cliente';
import express from 'express';
import cors from 'cors';
import { db } from './db';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { authMiddleware } from './middlewares/authMiddleware';
import avaliacaoRoutes from './routes/avaliacao';
import { ProdutoService, type ProdutoRow } from './services/ProdutoService';
import { adminMiddleware } from './middlewares/adminMiddleware';

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não configurada no arquivo .env');
}

app.use(cors());
app.use(express.json());


function idValido(valor: string | string[]): boolean {
  return (
    typeof valor === 'string' &&
    /^\d+$/.test(valor) &&
    Number(valor) > 0
  );
}


function precoValido(valor: unknown): boolean {
  return (
    valor !== null &&
    valor !== undefined &&
    valor !== '' &&
    Number.isFinite(Number(valor)) &&
    Number(valor) >= 0
  );
}

function estoqueValido(valor: unknown): boolean {
  return (
    valor !== null &&
    valor !== undefined &&
    valor !== '' &&
    Number.isInteger(Number(valor)) &&
    Number(valor) >= 0
  );
}

app.get('/', (req, res) => {
  res.send('API AgroVet funcionando!');
});

app.use('/api/avaliacoes', avaliacaoRoutes);

app.get('/api/produtos', async (req, res) => {
  try {
    const { busca } = req.query;

    let query = `
      SELECT
        p.id,
        p.id_categoria,
        p.nome,
        p.preco AS preco,
        p.estoque,
        p.imagem,
        p.descricao,
        c.nome AS categoria
      FROM produto p
      LEFT JOIN categoria c ON p.id_categoria = c.id
    `;

    const params: unknown[] = [];

    if (typeof busca === 'string' && busca.trim()) {
      query += ' WHERE p.nome LIKE ?';
      params.push(`%${busca.trim()}%`);
    }


    const [rows] = await db.query(query, params);

    const produtos = ProdutoService.converterProdutos(
      rows as ProdutoRow[]
    );

    res.json(produtos);

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      erro: 'Erro interno ao buscar produtos.'
    });
  }
});

app.get('/api/produtos/destaque', async (req, res) => {
  try {
    const [rows]: any = await db.query(
      'CALL sp_produtos_destaque()'
    );

    const produtos = Array.isArray(rows[0]) ? rows[0] : rows;
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar destaques:', error);
    res.status(500).json({
      erro: 'Erro interno ao buscar produtos em destaque.'
    });
  }
});

app.get('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({
        erro: 'ID do produto inválido.'
      });
    }

    const [rows]: any = await db.query(
      `
      SELECT
        p.id,
        p.id_categoria,
        p.nome,
        p.preco AS preco,
        p.estoque,
        p.imagem,
        p.descricao,
        c.nome AS categoria
      FROM produto p
      LEFT JOIN categoria c ON p.id_categoria = c.id
      WHERE p.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        erro: 'Produto não encontrado.'
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      erro: 'Erro interno ao buscar produto.'
    });
  }
});

app.post('/api/produtos', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      nome,
      preco,
      estoque,
      id_categoria,
      imagem,
      descricao
    } = req.body ?? {};

    if (typeof nome !== 'string' || !nome.trim()) {
      return res.status(400).json({
        erro: 'O nome do produto é obrigatório.'
      });
    }

    if (!precoValido(preco)) {
      return res.status(400).json({
        erro: 'Informe um preço válido.'
      });
    }

    if (!estoqueValido(estoque)) {
      return res.status(400).json({
        erro: 'Informe um estoque válido.'
      });
    }

    if (!idValido(String(id_categoria ?? ''))) {
      return res.status(400).json({
        erro: 'Informe uma categoria válida.'
      });
    }

    const [categorias]: any = await db.query(
      'SELECT id FROM categoria WHERE id = ?',
      [id_categoria]
    );

    if (categorias.length === 0) {
      return res.status(400).json({
        erro: 'A categoria informada não existe.'
      });
    }

    const [result]: any = await db.query(
      `
      INSERT INTO produto
        (nome, preco, estoque, id_categoria, imagem, descricao)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        nome.trim(),
        Number(preco),
        Number(estoque),
        Number(id_categoria),
        imagem || null,
        descricao || null
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Produto criado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({
      erro: 'Erro ao cadastrar produto.'
    });
  }
});

app.put('/api/produtos/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      preco,
      estoque,
      id_categoria,
      imagem,
      descricao
    } = req.body ?? {};

    if (!idValido(id)) {
      return res.status(400).json({
        erro: 'ID do produto inválido.'
      });
    }

    if (typeof nome !== 'string' || !nome.trim()) {
      return res.status(400).json({
        erro: 'O nome do produto é obrigatório.'
      });
    }

    if (!precoValido(preco) || !estoqueValido(estoque)) {
      return res.status(400).json({
        erro: 'Preço ou estoque inválido.'
      });
    }

    if (!idValido(String(id_categoria ?? ''))) {
      return res.status(400).json({
        erro: 'Categoria inválida.'
      });
    }

    const [categorias]: any = await db.query(
      'SELECT id FROM categoria WHERE id = ?',
      [id_categoria]
    );

    if (categorias.length === 0) {
      return res.status(400).json({
        erro: 'A categoria informada não existe.'
      });
    }

    const [result]: any = await db.query(
      `
      UPDATE produto
      SET
        nome = ?,
        preco = ?,
        estoque = ?,
        id_categoria = ?,
        imagem = ?,
        descricao = ?
      WHERE id = ?
      `,
      [
        nome.trim(),
        Number(preco),
        Number(estoque),
        Number(id_categoria),
        imagem || null,
        descricao || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        erro: 'Produto não encontrado para atualizar.'
      });
    }

    res.json({
      message: 'Produto atualizado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      erro: 'Erro ao atualizar produto.'
    });
  }
});

app.delete('/api/produtos/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({
        erro: 'ID do produto inválido.'
      });
    }

    const [result]: any = await db.query(
      'DELETE FROM produto WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        erro: 'Produto não encontrado.'
      });
    }

    res.json({
      message: 'Produto excluído com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({
      erro: 'Erro ao excluir produto.'
    });
  }
});

app.get('/api/categorias', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nome, `descricao` AS descricao FROM categoria'
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      erro: 'Erro ao buscar categorias.'
    });
  }
});

app.get('/api/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({
        erro: 'ID da categoria inválido.'
      });
    }

    const [rows]: any = await db.query(
      'SELECT id, nome, `descricao` AS descricao FROM categoria WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        erro: 'Categoria não encontrada.'
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({
      erro: 'Erro ao buscar categoria.'
    });
  }
});

app.post('/api/categorias', async (req, res) => {
  try {
    const { nome, descricao } = req.body ?? {};

    if (typeof nome !== 'string' || !nome.trim()) {
      return res.status(400).json({
        erro: 'O nome da categoria é obrigatório.'
      });
    }

    const [result]: any = await db.query(
      'INSERT INTO categoria (nome, `descricao`) VALUES (?, ?)',
      [nome.trim(), descricao || '']
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Categoria cadastrada com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao cadastrar categoria:', error);
    res.status(500).json({
      erro: 'Erro ao cadastrar categoria.'
    });
  }
});

app.put('/api/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body ?? {};

    if (!idValido(id)) {
      return res.status(400).json({
        erro: 'ID da categoria inválido.'
      });
    }

    if (typeof nome !== 'string' || !nome.trim()) {
      return res.status(400).json({
        erro: 'O nome da categoria é obrigatório.'
      });
    }

    const [result]: any = await db.query(
      'UPDATE categoria SET nome = ?, `descricao` = ? WHERE id = ?',
      [nome.trim(), descricao || '', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        erro: 'Categoria não encontrada.'
      });
    }

    res.json({
      message: 'Categoria atualizada com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({
      erro: 'Erro ao atualizar categoria.'
    });
  }
});

app.delete('/api/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({
        erro: 'ID da categoria inválido.'
      });
    }

    const [result]: any = await db.query(
      'DELETE FROM categoria WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        erro: 'Categoria não encontrada.'
      });
    }

    res.json({
      message: 'Categoria excluída com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({
      erro: 'Erro ao excluir categoria.'
    });
  }
});

app.get('/api/fornecedores', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM fornecedor'
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({
      erro: 'Erro ao buscar fornecedores.'
    });
  }
});

app.get('/api/fornecedores/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({
        erro: 'ID do fornecedor inválido.'
      });
    }

    const [rows]: any = await db.query(
      'SELECT * FROM fornecedor WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        erro: 'Fornecedor não encontrado.'
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    res.status(500).json({
      erro: 'Erro ao buscar fornecedor.'
    });
  }
});

app.post('/api/fornecedores', async (req, res) => {
  try {
    const { nome, cnpj, telefone, email } = req.body ?? {};

    if (typeof nome !== 'string' || !nome.trim()) {
      return res.status(400).json({
        erro: 'O nome do fornecedor é obrigatório.'
      });
    }

    const [result]: any = await db.query(
      `
      INSERT INTO fornecedor
        (nome, cnpj, telefone, email)
      VALUES (?, ?, ?, ?)
      `,
      [
        nome.trim(),
        cnpj || null,
        telefone || null,
        email || null
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Fornecedor cadastrado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao cadastrar fornecedor:', error);
    res.status(500).json({
      erro: 'Erro ao cadastrar fornecedor.'
    });
  }
});

app.put('/api/fornecedores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cnpj, telefone, email } = req.body ?? {};

    if (!idValido(id)) {
      return res.status(400).json({
        erro: 'ID do fornecedor inválido.'
      });
    }

    if (typeof nome !== 'string' || !nome.trim()) {
      return res.status(400).json({
        erro: 'O nome do fornecedor é obrigatório.'
      });
    }

    const [result]: any = await db.query(
      `
      UPDATE fornecedor
      SET nome = ?, cnpj = ?, telefone = ?, email = ?
      WHERE id = ?
      `,
      [
        nome.trim(),
        cnpj || null,
        telefone || null,
        email || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        erro: 'Fornecedor não encontrado.'
      });
    }

    res.json({
      message: 'Fornecedor atualizado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({
      erro: 'Erro ao atualizar fornecedor.'
    });
  }
});

app.delete('/api/fornecedores/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return res.status(400).json({
        erro: 'ID do fornecedor inválido.'
      });
    }

    const [result]: any = await db.query(
      'DELETE FROM fornecedor WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        erro: 'Fornecedor não encontrado.'
      });
    }

    res.json({
      message: 'Fornecedor excluído com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao excluir fornecedor:', error);
    res.status(500).json({
      erro: 'Erro ao excluir fornecedor.'
    });
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
      mensagem:
        'A senha deve ter pelo menos 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
    });
  }

  try {
    const usuario: Usuario = new Cliente(nome, email, cpf, telefone);
    const senhaHash = await bcrypt.hash(senha, 12);

    await db.execute(
      `
      INSERT INTO usuario
        (nome, email, cpf, telefone, senha)
      VALUES (?, ?, ?, ?, ?)
      `,
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
    if (
      erro instanceof Error &&
      [
        'O nome não pode estar vazio!',
        'Formato de e-mail inválido!',
        'CPF inválido!',
        'Telefone inválido!'
      ].includes(erro.message)
    ) {
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

  if (
    typeof email !== 'string' || !email.trim() ||
    typeof senha !== 'string' || !senha
  ) {
    return res.status(400).json({
      mensagem: 'E-mail e senha são obrigatórios!'
    });
  }

  try {
    const [rows]: any = await db.execute(
      'SELECT id, nome, email, senha, tipo_usuario FROM usuario WHERE email = ?',
      [email.trim()]
    );

    const usuario = rows[0];

    if (
      !usuario ||
      !(await bcrypt.compare(senha, usuario.senha))
    ) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha incorretos!'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        tipo_usuario: usuario.tipo_usuario
      },
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


app.get('/api/perfil', authMiddleware, async (req, res) => {
  try {
    const usuarioId = res.locals.usuarioId;

    const [rows]: any = await db.execute(
      `SELECT id, nome, email, cpf, telefone
       FROM usuario
       WHERE id = ?`,
      [usuarioId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Usuário não encontrado!'
      });
    }

    return res.status(200).json({
      mensagem: 'Perfil consultado com sucesso!',
      usuario: rows[0]
    });

  } catch (erro) {
    console.error('Erro ao consultar perfil:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno ao consultar perfil!'
    });
  }
});


app.put('/api/perfil', authMiddleware, async (req, res) => {
  try {
    const usuarioId = res.locals.usuarioId;
    const { nome, cpf, telefone, senha, confirmarSenha, email } = req.body ?? {};

    if (email !== undefined) {
      return res.status(400).json({
        mensagem: 'O e-mail não pode ser alterado!'
      });
    }

    const [rows]: any = await db.execute(
      'SELECT id, nome, email, cpf, telefone FROM usuario WHERE id = ?',
      [usuarioId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Usuário não encontrado!'
      });
    }

    const atual = rows[0];

    const usuario: Usuario = new Cliente(
      nome ?? atual.nome,
      atual.email,
      cpf ?? atual.cpf,
      telefone ?? atual.telefone
    );

    let senhaHash: string | null = null;

    if (senha !== undefined) {
      if (typeof senha !== 'string' || !(
        senha.length >= 8 &&
        /[A-Z]/.test(senha) &&
        /[a-z]/.test(senha) &&
        /[0-9]/.test(senha) &&
        /[^A-Za-z0-9]/.test(senha)
      )) {
        return res.status(400).json({
          mensagem: 'A senha deve ter pelo menos 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
        });
      }

      if (senha !== confirmarSenha) {
        return res.status(400).json({
          mensagem: 'As senhas não coincidem!'
        });
      }

      senhaHash = await bcrypt.hash(senha, 12);
    }

    const [duplicados]: any = await db.execute(
      'SELECT id FROM usuario WHERE cpf = ? AND id <> ?',
      [usuario.cpf, usuarioId]
    );

    if (duplicados.length > 0) {
      return res.status(409).json({
        mensagem: 'CPF já cadastrado por outro usuário!'
      });
    }

    if (senhaHash !== null) {
      await db.execute(
        'UPDATE usuario SET nome = ?, cpf = ?, telefone = ?, senha = ? WHERE id = ?',
        [usuario.nome, usuario.cpf, usuario.telefone, senhaHash, usuarioId]
      );
    } else {
      await db.execute(
        'UPDATE usuario SET nome = ?, cpf = ?, telefone = ? WHERE id = ?',
        [usuario.nome, usuario.cpf, usuario.telefone, usuarioId]
      );
    }

    return res.status(200).json({
      mensagem: 'Perfil atualizado com sucesso!'
    });

  } catch (erro: unknown) {
    if (
      erro instanceof Error &&
      [
        'O nome não pode estar vazio!',
        'CPF inválido!',
        'Telefone inválido!',
        'Formato de e-mail inválido!'
      ].includes(erro.message)
    ) {
      return res.status(400).json({
        mensagem: erro.message
      });
    }

    const erroBanco = erro as { code?: string };

    if (erroBanco.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        mensagem: 'CPF já cadastrado por outro usuário!'
      });
    }

    console.error('Erro ao atualizar perfil:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno ao atualizar perfil!'
    });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});
