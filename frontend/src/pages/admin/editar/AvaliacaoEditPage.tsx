
import { useEffect, useState } from "react";
import { api } from "../../../api/axios";

type Avaliacao = {
  id: number;
  id_produto: number;
  produto: string;
  usuario: string;
  nota: number;
  comentario: string | null;
};

type Props = {
  avaliacaoId: number;
  onSuccess?: () => void;
};

export function AvaliacaoEditPage({
  avaliacaoId,
  onSuccess,
}: Props) {
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [nota, setNota] = useState<number>(5);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarAvaliacao() {
      setLoading(true);
      setErro("");

      try {
        // A API retorna a lista completa de avaliações.
        const response = await api.get<Avaliacao[]>("/avaliacoes");

        const encontrada = response.data.find(
          (item) => item.id === avaliacaoId
        );

        if (!encontrada) {
          if (ativo) {
            setErro("Avaliação não encontrada.");
          }
          return;
        }

        if (ativo) {
          setAvaliacao(encontrada);
          setNota(encontrada.nota);
          setComentario(encontrada.comentario ?? "");
        }
      } catch (error) {
        console.error("Erro ao carregar avaliação:", error);

        if (ativo) {
          setErro("Não foi possível carregar a avaliação.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarAvaliacao();

    return () => {
      ativo = false;
    };
  }, [avaliacaoId]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMensagem("");
    setErro("");

    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
      setErro("Selecione uma nota entre 1 e 5.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Você precisa estar logado para editar avaliações.");
      return;
    }

    setSalvando(true);

    try {
      await api.put(
        `/avaliacoes/${avaliacaoId}`,
        {
          nota,
          comentario: comentario.trim() || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensagem("Avaliação atualizada com sucesso!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro ao editar avaliação:", error);

      setErro(
        error.response?.data?.mensagem ||
        "Não foi possível atualizar a avaliação."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <p className="my-4 text-center">
        Carregando avaliação...
      </p>
    );
  }

  if (!avaliacao) {
    return (
      <div className="alert alert-danger my-4">
        {erro || "Avaliação não encontrada."}
      </div>
    );
  }

  return (
    <div className="card p-4 shadow-sm border-0 my-4">
      <h2 className="mb-4">Editar Avaliação</h2>

      {erro && (
        <div className="alert alert-danger">
          {erro}
        </div>
      )}

      {mensagem && (
        <div className="alert alert-success">
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Produto
          </label>

          <input
            type="text"
            className="form-control"
            value={avaliacao.produto}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Usuário
          </label>

          <input
            type="text"
            className="form-control"
            value={avaliacao.usuario}
            disabled
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="nota-avaliacao"
            className="form-label fw-semibold"
          >
            Nota *
          </label>

          <select
            id="nota-avaliacao"
            className="form-select"
            value={nota}
            onChange={(e) => setNota(Number(e.target.value))}
            required
          >
            <option value={1}>1 - Muito ruim</option>
            <option value={2}>2 - Ruim</option>
            <option value={3}>3 - Regular</option>
            <option value={4}>4 - Bom</option>
            <option value={5}>5 - Excelente</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="comentario-avaliacao"
            className="form-label fw-semibold"
          >
            Comentário
          </label>

          <textarea
            id="comentario-avaliacao"
            className="form-control"
            rows={4}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Escreva seu comentário sobre o produto..."
          />
        </div>

        <button
          type="submit"
          className="btn btn-success fw-bold"
          disabled={salvando}
        >
          {salvando ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}
