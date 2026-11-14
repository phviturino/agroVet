import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({
      mensagem: 'Token de autenticação não informado!'
    });
    return;
  }

  const token = authorization.slice(7);
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    res.status(500).json({
      mensagem: 'Configuração de autenticação indisponível!'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === 'string' ||
      typeof decoded.id !== 'number'
    ) {
      res.status(401).json({
        mensagem: 'Token sem identificação válida!'
      });
      return;
    }

    res.locals.usuarioId = decoded.id;

    if (
      decoded.tipo_usuario !== "admin" &&
      decoded.tipo_usuario !== "cliente"
    ) {
      res.status(401).json({
        mensagem: "Token sem perfil de usuário válido!"
      });
      return;
    }

    res.locals.tipoUsuario = decoded.tipo_usuario;

    next();

  } catch {
    res.status(401).json({
      mensagem: 'Token inválido ou expirado!'
    });
  }
}