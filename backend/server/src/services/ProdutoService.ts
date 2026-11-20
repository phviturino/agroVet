import { Produto } from '../models/Produto';
import type { IProduto } from '../interfaces/IProduto';

export interface ProdutoRow {
  id: number;
  id_categoria: number;
  nome: string;
  preco: string | null;
  estoque: number | null;
  imagem: string | null;
  descricao: string | null;
  categoria: string | null;
}

type CriadorProduto = (row: ProdutoRow) => IProduto;

export class ProdutoService {
  private static criadorPadrao: CriadorProduto = (row) =>
    new Produto(
      row.id_categoria,
      row.nome,
      row.preco === null ? null : Number(row.preco),
      row.estoque,
      row.imagem,
      row.descricao
    );

  static converterProduto(
    row: ProdutoRow,
    criarProduto: CriadorProduto = ProdutoService.criadorPadrao
  ) {
    const produto = criarProduto(row);

    return {
      id: row.id,
      id_categoria: produto.idCategoria,
      nome: produto.nome,
      preco: produto.preco === null
        ? null
        : produto.preco.toFixed(2),
      estoque: produto.estoque,
      imagem: produto.imagem,
      descricao: produto.descricao,
      categoria: row.categoria
    };
  }

  static converterProdutos(
    rows: ProdutoRow[],
    criarProduto: CriadorProduto = ProdutoService.criadorPadrao
  ) {
    return rows.map((row) =>
      this.converterProduto(row, criarProduto)
    );
  }
}
