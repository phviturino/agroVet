import { Router, Request, Response } from 'express';
import { db } from '../db';
import type { IApiResponse } from '../interfaces/IApiResponse';
import type { RowDataPacket } from 'mysql2';

const router = Router();

interface ProdutoCatalogo extends RowDataPacket {
  id: number;
  nome: string;
  preco: number;
  imagem: string | null;
  categoria: string;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const termoBusca = req.query.busca as string | undefined;

    let query = 'SELECT id, nome, preco AS preço, imagem, categoria FROM produtos';
    const params: string[] = [];

    if (termoBusca) {
      query += ' WHERE nome LIKE ?';
      params.push(`%${termoBusca}%`);
    }

    const [rows] = await db.query<ProdutoCatalogo[]>(query, params);

    const resposta: IApiResponse<ProdutoCatalogo[]> = {
      sucesso: true,
      mensagem: 'Produtos encontrados com sucesso!',
      dados: rows
    };

    res.json(resposta.dados);

  } catch (error: unknown) {
    console.error('Erro no MySQL:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

export default router;
