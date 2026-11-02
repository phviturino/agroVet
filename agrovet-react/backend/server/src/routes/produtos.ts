import { Router, Request, Response } from 'express';
import { db } from '../db'; // Ajusta o caminho conforme o teu ficheiro de conexão

const router = Router();

// Rota que busca os produtos diretamente do MySQL
router.get('/', async (req: Request, res: Response) => {
  try {
    const termoBusca = req.query.busca as string | undefined;
    let query = 'SELECT id, nome, preco AS preço, imagem, categoria FROM produtos';
    const params: (string | number)[] = [];

    if (termoBusca) {
      query += ' WHERE nome LIKE ?';
      params.push(`%${termoBusca}%`);
    }

    const [rows] = await db.query(query, params);
    res.json(rows); // Retorna os produtos do MySQL em JSON
  } catch (error) {
    console.error('Erro no MySQL:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

export default router;