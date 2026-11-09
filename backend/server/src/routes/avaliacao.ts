import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const idUsuario = res.locals.usuarioId;
    const { id_produto, nota, comentario } = req.body;

    if (
      !Number.isInteger(id_produto) ||
      id_produto <= 0 ||
      !Number.isInteger(nota) ||
      nota < 1 ||
      nota > 5
    ) {
      res.status(400).json({
        mensagem: 'Informe um produto válido e uma nota de 1 a 5!'
      });
      return;
    }

    const [resultado] = await db.execute(
      `INSERT INTO avaliacao
       (id_usuario, id_produto, nota, comentario)
       VALUES (?, ?, ?, ?)`,
      [idUsuario, id_produto, nota, comentario ?? null]
    );

    res.status(201).json({
      mensagem: 'Avaliação cadastrada com sucesso!',
      resultado
    });

  } catch (error) {
    console.error('Erro ao cadastrar avaliação:', error);

    res.status(500).json({
      mensagem: 'Erro ao cadastrar avaliação!'
    });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const [avaliacoes] = await db.query(`
      SELECT
        a.id,
        a.id_produto,
        p.nome AS produto,
        u.nome AS usuario,
        a.nota,
        a.comentario,
        a.criado_em
      FROM avaliacao a
      INNER JOIN produto p ON a.id_produto = p.id
      INNER JOIN usuario u ON a.id_usuario = u.id
      ORDER BY a.criado_em DESC, a.id DESC
    `);

    res.status(200).json(avaliacoes);

  } catch (error) {
    console.error('Erro ao consultar avaliações:', error);

    res.status(500).json({
      mensagem: 'Erro ao consultar avaliações!'
    });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const idAvaliacao = Number(req.params.id);
    const idUsuario = res.locals.usuarioId;
    const { nota, comentario } = req.body ?? {};

    if (!Number.isInteger(idAvaliacao) || idAvaliacao <= 0 ||
        !Number.isInteger(nota) || nota < 1 || nota > 5 ||
        (comentario != null && typeof comentario !== 'string')) {
      res.status(400).json({
        mensagem: 'Informe uma avaliação válida e uma nota de 1 a 5!'
      });
      return;
    }

    const [resultado] = await db.execute<import('mysql2').ResultSetHeader>(
      `UPDATE avaliacao
       SET nota = ?, comentario = ?
       WHERE id = ? AND id_usuario = ?`,
      [nota, comentario ?? null, idAvaliacao, idUsuario]
    );

    if (resultado.affectedRows === 0) {
      res.status(404).json({
        mensagem: 'Avaliação não encontrada ou não pertence ao usuário!'
      });
      return;
    }

    res.status(200).json({
      mensagem: 'Avaliação atualizada com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    res.status(500).json({
      mensagem: 'Erro ao atualizar avaliação!'
    });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const idAvaliacao = Number(req.params.id);
    const idUsuario = res.locals.usuarioId;

    if (!Number.isInteger(idAvaliacao) || idAvaliacao <= 0) {
      res.status(400).json({
        mensagem: 'ID de avaliação inválido!'
      });
      return;
    }

    const [resultado] = await db.execute<import('mysql2').ResultSetHeader>(
      `DELETE FROM avaliacao
       WHERE id = ? AND id_usuario = ?`,
      [idAvaliacao, idUsuario]
    );

    if (resultado.affectedRows === 0) {
      res.status(404).json({
        mensagem: 'Avaliação não encontrada ou não pertence ao usuário!'
      });
      return;
    }

    res.status(200).json({
      mensagem: 'Avaliação excluída com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao excluir avaliação:', error);

    res.status(500).json({
      mensagem: 'Erro ao excluir avaliação!'
    });
  }
});

export default router;