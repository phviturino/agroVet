
import type { Request, Response, NextFunction } from "express";
import type { RowDataPacket } from "mysql2";
import { db } from "../db";
import { Usuario } from "../models/Usuario";
import { Administrador } from "../models/Administrador";
import { Cliente } from "../models/Cliente";

interface UsuarioRow extends RowDataPacket {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  tipo_usuario: "admin" | "cliente";
}

export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const usuarioId = res.locals.usuarioId;

    if (typeof usuarioId !== "number") {
      res.status(401).json({
        mensagem: "Usuário não autenticado!"
      });
      return;
    }

    const [rows] = await db.execute<UsuarioRow[]>(
      `SELECT nome, email, cpf, telefone, tipo_usuario
       FROM usuario WHERE id = ?`,
      [usuarioId]
    );

    if (rows.length === 0) {
      res.status(401).json({
        mensagem: "Usuário não encontrado!"
      });
      return;
    }

    const dados = rows[0];

    const usuario: Usuario =
      dados.tipo_usuario === "admin"
        ? new Administrador(
            dados.nome, dados.email, dados.cpf, dados.telefone
          )
        : new Cliente(
            dados.nome, dados.email, dados.cpf, dados.telefone
          );

    if (!usuario.podeGerenciarProdutos()) {
      res.status(403).json({
        mensagem: "Acesso permitido apenas para administradores!"
      });
      return;
    }

    next();
  } catch (erro) {
    console.error("Erro na autorização:", erro);

    res.status(500).json({
      mensagem: "Erro interno ao verificar permissões!"
    });
  }
}
