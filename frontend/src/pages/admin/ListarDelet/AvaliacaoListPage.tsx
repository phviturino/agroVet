
import { useEffect, useState } from "react";
import { api } from "../../../api/axios";

type Avaliacao = {
  id: number;
  id_produto: number;
  produto: string;
  usuario: string;
  nota: number;
  comentario: string | null;
  criado_em: string;
};

type Props = {
  onEdit?: (id: number) => void;
};

export function AvaliacaoListPage({ onEdit }: Props) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const avaliacoesPorPagina = 10;

  const totalPaginas = Math.ceil(
    avaliacoes.length / avaliacoesPorPagina
  );

  const avaliacoesPaginadas = avaliacoes.slice(
    (paginaAtual - 1) * avaliacoesPorPagina,
    paginaAtual * avaliacoesPorPagina
  );

  async function carregarAvaliacoes() {
    setLoading(true);

    try {
      const response = await api.get<Avaliacao[]>("/avaliacoes");

      setAvaliacoes(response.data);

      setPaginaAtual((pagina) =>
        Math.max(
          1,
          Math.min(
            pagina,
            Math.ceil(response.data.length / avaliacoesPorPagina)
          )
        )
      );
    } catch (err) {
      console.error("Erro ao carregar avaliações:", err);
      alert("Erro ao carregar lista de avaliações.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta avaliação?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Você precisa estar logado para excluir avaliações.");
        return;
      }

      await api.delete(`/avaliacoes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Avaliação excluída com sucesso!");

      await carregarAvaliacoes();
    } catch (err) {
      console.error("Erro ao excluir avaliação:", err);
      alert(
        "Não foi possível excluir a avaliação. Verifique se ela pertence ao seu usuário."
      );
    }
  }

  if (loading) {
    return (
      <p className="my-4 text-center">
        Carregando avaliações...
      </p>
    );
  }

  return (
    <div className="card p-4 shadow-sm border-0 my-4">
      <h2 className="mb-4">Gerenciar Avaliações</h2>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Usuário</th>
              <th>Nota</th>
              <th>Comentário</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>

          <tbody>
            {avaliacoesPaginadas.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.produto}</td>
                <td>{a.usuario}</td>
                <td>{a.nota} / 5</td>
                <td>{a.comentario || "-"}</td>

                <td className="text-end">
                  {onEdit && (
                    <button
                      className="btn btn-warning btn-sm me-2 fw-bold"
                      onClick={() => onEdit(a.id)}
                    >
                      Editar
                    </button>
                  )}

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(a.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {avaliacoes.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-muted"
                >
                  Nenhuma avaliação cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
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

      {avaliacoes.length > 0 && (
        <p className="text-center text-muted small mt-3 mb-0">
          Exibindo{" "}
          {(paginaAtual - 1) * avaliacoesPorPagina + 1}
          {" a "}
          {Math.min(
            paginaAtual * avaliacoesPorPagina,
            avaliacoes.length
          )}
          {" de "}
          {avaliacoes.length} avaliações
        </p>
      )}
    </div>
  );
}
