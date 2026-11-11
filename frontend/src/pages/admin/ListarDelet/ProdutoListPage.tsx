import { useEffect, useState } from "react";
import { api } from "../../../api/axios";

type Produto = {
  id: number;
  nome: string;
  preço: number;
  imagem: string;
  descricao: string;
};

type Props = {
  onEdit?: (id: number) => void;
};

export function ProdutoListPage({ onEdit }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const produtosPorPagina = 10;

  const totalPaginas = Math.ceil(
    produtos.length / produtosPorPagina
  );

  const produtosPaginados = produtos.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

  async function carregarProdutos() {
    setLoading(true);

    try {
      const response = await api.get<Produto[]>("/produtos");

      setProdutos(response.data);

      setPaginaAtual((pagina) =>
        Math.max(
          1,
          Math.min(
            pagina,
            Math.ceil(response.data.length / produtosPorPagina)
          )
        )
      );
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      alert("Erro ao carregar lista de produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) {
      return;
    }

    try {
      await api.delete(`/produtos/${id}`);

      alert("Produto excluído com sucesso!");

      await carregarProdutos();
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      alert("Erro ao excluir o produto.");
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
            {produtosPaginados.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>R$ {Number(p.preço).toFixed(2)}</td>

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
                <td
                  colSpan={4}
                  className="text-center text-muted"
                >
                  Nenhum produto cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
          <button
            className="btn btn-outline-primary"
            disabled={paginaAtual === 1}
            onClick={() => setPaginaAtual((p) => p - 1)}
          >
            Anterior
          </button>

          <span className="fw-semibold">
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            className="btn btn-outline-primary"
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual((p) => p + 1)}
          >
            Próxima
          </button>
        </div>
      )}

      {produtos.length > 0 && (
        <p className="text-center text-muted small mt-3 mb-0">
          Exibindo{" "}
          {(paginaAtual - 1) * produtosPorPagina + 1}
          {" a "}
          {Math.min(
            paginaAtual * produtosPorPagina,
            produtos.length
          )}
          {" de "}
          {produtos.length} produtos
        </p>
      )}
    </div>
  );
}
