export interface IProduto {
  idCategoria: number;
  nome: string;
  preco: number | null;
  estoque: number | null;
  imagem: string | null;
  descricao: string | null;
}
