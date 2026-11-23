
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import Paginacao from "../../../components/Paginacao";

type Produto = {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  descricao: string;
};

type RespostaProdutos = {
  dados: Produto[];
  paginacao: {
    paginaAtual: number;
    limite: number;
    totalRegistros: number;
    totalPaginas: number;
  };
};

type Props = {
  onEdit?: (id: number) => void;
};

export function ProdutoListPage({ onEdit }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const produtosPorPagina = 10;

  async function carregarProdutos(pagina: number) {
    setLoading(true);

    try {
      const response = await api.get<RespostaProdutos>("/produtos", {
        params: {
          page: pagina,
          limit: produtosPorPagina
        }
      });

      setProdutos(response.data.dados);
      setTotalPaginas(response.data.paginacao.totalPaginas);
      setTotalRegistros(response.data.paginacao.totalRegistros);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      toast.error("Erro ao carregar lista de produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProdutos(paginaAtual);
  }, [paginaAtual]);

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) {
      return;
    }

    try {
      await api.delete(`/produtos/${id}`);

      toast.success("Produto excluído com sucesso!");

      // Se a página ficar vazia após a exclusão,
      // voltamos para a página anterior.
      if (produtos.length === 1 && paginaAtual > 1) {
        setPaginaAtual(paginaAtual - 1);
      } else {
        await carregarProdutos(paginaAtual);
      }
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      toast.error("Erro ao excluir o produto.");
    }
  }

  if (loading) {
    return (
      <p className="my-4 text-center">
        Carregando produtos...
      </p>
    );
  }

  return (
    <div className="card p-4 shadow-sm border-0 my-4">
      <h2 className="mb-4">Gerenciar Produtos</h2>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>R$ {Number(p.preco).toFixed(2)}</td>

                <td className="text-end">
                  {onEdit && (
                    <button
                      className="btn btn-warning btn-sm me-2 fw-bold"
                      onClick={() => onEdit(p.id)}
                    >
                      Editar
                    </button>
                  )}

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {produtos.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  Nenhum produto cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Paginacao
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        aoMudarPagina={setPaginaAtual}
      />

      {produtos.length > 0 && (
        <p className="text-center text-muted small mt-3 mb-0">
          Exibindo{" "}
          {(paginaAtual - 1) * produtosPorPagina + 1}
          {" a "}
          {Math.min(
            paginaAtual * produtosPorPagina,
            totalRegistros
          )}
          {" de "}
          {totalRegistros} produtos
        </p>
      )}
    </div>
  );
}
