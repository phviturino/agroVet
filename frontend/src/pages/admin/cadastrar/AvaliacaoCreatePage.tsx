
import { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import axios from "axios";

type Produto = {
  id: number;
  nome: string;
};

export function AvaliacaoCreatePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [idProduto, setIdProduto] = useState("");
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarProdutos() {
      try {
        const response = await api.get<Produto[]>("/produtos");

        if (ativo) {
          setProdutos(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);

        if (ativo) {
          setErro("Não foi possível carregar os produtos.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarProdutos();

    return () => {
      ativo = false;
    };
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro("");
    setMensagem("");

    const produtoSelecionado = Number(idProduto);

    if (
      !Number.isInteger(produtoSelecionado) ||
      produtoSelecionado <= 0
    ) {
      setErro("Selecione um produto válido.");
      return;
    }

    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
      setErro("Selecione uma nota entre 1 e 5.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Você precisa estar logado para cadastrar avaliações.");
      return;
    }

    setSalvando(true);

    try {
      await api.post(
        "/avaliacoes",
        {
          id_produto: produtoSelecionado,
          nota,
          comentario: comentario.trim() || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensagem("Avaliação cadastrada com sucesso!");

      setIdProduto("");
      setNota(5);
      setComentario("");
    } catch (error: unknown) {
      console.error("Erro ao cadastrar avaliação:", error);

      if (axios.isAxiosError(error)) {
        setErro(
          error.response?.data?.mensagem ||
          "Não foi possível cadastrar a avaliação."
        );
      } else {
        setErro("Ocorreu um erro inesperado.");
      }
    } finally {
      setSalvando(false);
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
      <h2 className="mb-4">Cadastrar Avaliação</h2>

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
          <label
            htmlFor="produto-avaliacao"
            className="form-label fw-semibold"
          >
            Produto *
          </label>

          <select
            id="produto-avaliacao"
            className="form-select"
            value={idProduto}
            onChange={(e) => setIdProduto(e.target.value)}
            required
          >
            <option value="">Selecione um produto</option>

            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>

          {produtos.length === 0 && (
            <small className="text-muted">
              Nenhum produto disponível para avaliação.
            </small>
          )}
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
            placeholder="Escreva sua avaliação sobre o produto..."
          />
        </div>

        <button
          type="submit"
          className="btn btn-success fw-bold"
          disabled={salvando || produtos.length === 0}
        >
          {salvando ? "Cadastrando..." : "Cadastrar Avaliação"}
        </button>
      </form>
    </div>
  );
}
